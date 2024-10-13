package services

import (
	"log"
	"time"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/models"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/repository"
	"github.com/ciarnellicarlo/ps-performance-app/backend/pkg/igdb"
	"go.mongodb.org/mongo-driver/mongo"
)

type GameService struct {
	igdbClient *igdb.Client
	gameRepo   *repository.GameRepository
}

func NewGameService(igdbClient *igdb.Client, gameRepo *repository.GameRepository) *GameService {
	return &GameService{
		igdbClient: igdbClient,
		gameRepo:   gameRepo,
	}
}

func (s *GameService) GetRandomGames(page, count int) ([]*models.Game, error) {
    // First, try to get random games from our database
    localGames, err := s.gameRepo.GetRandomGames(page, count)
    if err == nil && len(localGames) == count {
        log.Printf("Found %d random games in local database for page %d", len(localGames), page)
        return localGames, nil
    }

    // If we don't have enough games in our database, fetch from IGDB
    igdbGames, err := s.igdbClient.GetRandomGames(page, count)
    if err != nil {
        log.Printf("Error fetching random games from IGDB: %v", err)
        return nil, err
    }

    var games []*models.Game
    for _, igdbGame := range igdbGames {
        game := convertIGDBToGameModel(&igdbGame)
        if isPSGame(game) {
            // Save the game to our database
            err = s.gameRepo.CreateGame(game)
            if err != nil {
                log.Printf("Error saving game to database: %v", err)
            }
            games = append(games, game)
        }
    }

    return games, nil
}

func (s *GameService) SearchGame(name string) ([]*models.Game, error) {
	log.Printf("Searching for game: %s", name)

	// First, check our database
	localGames, err := s.gameRepo.GetGamesByTitle(name)
	if err == nil && len(localGames) > 0 {
		log.Printf("Found %d games in local database for query: %s", len(localGames), name)
		return localGames, nil
	} else {
		log.Printf("Games not found in local database: %v", err)
	}

	// If not found locally, search IGDB
	log.Printf("Searching IGDB for game: %s", name)
	igdbGames, err := s.igdbClient.SearchGame(name)
	if err != nil {
		log.Printf("Error searching IGDB: %v", err)
		return nil, err
	}

	var games []*models.Game
	for _, igdbGame := range igdbGames {
		game := convertIGDBToGameModel(&igdbGame)
		if isPSGame(game) {
			log.Printf("PS game found from IGDB: %s", game.Title)

			// Check if the game already exists in our database
			existingGames, err := s.gameRepo.GetGamesByTitle(game.Title)
			if err == mongo.ErrNoDocuments || len(existingGames) == 0 {
				log.Printf("Game not found in database, creating new entry: %s", game.Title)
				err = s.gameRepo.CreateGame(game)
				if err != nil {
					log.Printf("Error creating game in database: %v", err)
				} else {
					log.Printf("Game successfully created in database: %s", game.Title)
				}
				games = append(games, game)
			} else if err == nil && len(existingGames) > 0 {
				log.Printf("Game already exists in database, using existing entry: %s", existingGames[0].Title)
				games = append(games, existingGames[0])
			} else {
				log.Printf("Error checking for existing game: %v", err)
			}
		} else {
			log.Printf("Skipping non-PS game: %s", game.Title)
		}
	}

	return games, nil
}

func isPSGame(game *models.Game) bool {
	for _, console := range game.Consoles {
		if console == "PlayStation 4" || console == "PlayStation 5" {
			return true
		}
	}
	return false
}

func convertIGDBToGameModel(igdbGame *igdb.Game) *models.Game {
	game := &models.Game{
		Title:       igdbGame.Name,
		CoverArtURL: igdbGame.Cover.URL,
		ReleaseYear: time.Unix(int64(igdbGame.FirstRelease), 0).Year(),
	}

	// Only include PS4 and PS5 in the Consoles slice
	for _, platform := range igdbGame.Platforms {
		if platform.Name == "PlayStation 4" || platform.Name == "PlayStation 5" {
			game.Consoles = append(game.Consoles, platform.Name)
		}
	}

	// Initialize empty performance data
	game.PS4 = models.ConsolePerformance{}
	game.PS5 = models.ConsolePerformance{}

	return game
}
