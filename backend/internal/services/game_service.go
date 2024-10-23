package services

import (
	"fmt"
	"log"
	"time"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/models"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/repository"
	"github.com/ciarnellicarlo/ps-performance-app/backend/pkg/igdb"
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

func (s *GameService) GetRandomGames(page, count int, consoleFilter string) ([]*models.Game, error) {
	games, err := s.gameRepo.GetRandomGames(page, count, consoleFilter)
	if err != nil {
		log.Printf("Error fetching random games from database: %v", err)
		return nil, fmt.Errorf("error fetching random games: %w", err)
	}

	if len(games) == 0 {
		return nil, fmt.Errorf("no games found in the database")
	}

	return games, nil
}

func (s *GameService) GetGameByID(id string) (*models.Game, error) {
    return s.gameRepo.GetGameByID(id)
}

func (s *GameService) SearchGame(name string, consoleFilter string) ([]*models.Game, error) {
	games, err := s.gameRepo.GetGamesByTitle(name, consoleFilter)
	if err != nil {
		log.Printf("Error searching games in database: %v", err)
	}

	if len(games) == 0 {
		igdbGames, err := s.igdbClient.SearchGames(name, false)
		if err != nil {
			return nil, fmt.Errorf("error searching IGDB: %w", err)
		}

		games = s.convertAndFilterGames(igdbGames, consoleFilter)

		for _, game := range games {
			if err := s.gameRepo.UpsertGame(game); err != nil {
				log.Printf("Error storing game in database: %v", err)
			}
		}
	}

	return games, nil
}

func (s *GameService) convertAndFilterGames(igdbGames []igdb.Game, consoleFilter string) []*models.Game {
	var games []*models.Game

	for _, igdbGame := range igdbGames {
		// Determine game platform
        hasPS4, hasPS5 := false, false
        for _, platform := range igdbGame.Platforms {
            if platform.Name == string(models.PS4) {  // Now matches "PlayStation 4"
                hasPS4 = true
            } else if platform.Name == string(models.PS5) {  // Now matches "PlayStation 5"
                hasPS5 = true
            }
        }

		// Create PS4 version if available
		if hasPS4 && (consoleFilter == "" || consoleFilter == "PlayStation 4") {
			ps4Game := &models.Game{
				Title:       fmt.Sprintf("[PS4] %s", igdbGame.Name),
				CoverArtURL: igdbGame.Cover.URL,
				ReleaseYear: time.Unix(int64(igdbGame.FirstRelease), 0).Year(),
				Platform:    models.PS4,
				CompatibleConsoles: make(map[models.ConsoleType]models.ConsolePerformance),
			}

			// Initialize performance data for all compatible consoles
			compatibleConsoles := models.GetCompatibleConsoles(models.PS4)
			for _, consoleType := range compatibleConsoles {
				ps4Game.CompatibleConsoles[consoleType] = models.NewEmptyConsolePerformance()
			}

			games = append(games, ps4Game)
		}

		// Create PS5 version if available
		if hasPS5 && (consoleFilter == "" || consoleFilter == "PlayStation 5") {
			ps5Game := &models.Game{
				Title:       fmt.Sprintf("[PS5] %s", igdbGame.Name),
				CoverArtURL: igdbGame.Cover.URL,
				ReleaseYear: time.Unix(int64(igdbGame.FirstRelease), 0).Year(),
				Platform:    models.PS5,
				CompatibleConsoles: make(map[models.ConsoleType]models.ConsolePerformance),
			}

			// Initialize performance data for compatible consoles
			compatibleConsoles := models.GetCompatibleConsoles(models.PS5)
			for _, consoleType := range compatibleConsoles {
				ps5Game.CompatibleConsoles[consoleType] = models.NewEmptyConsolePerformance()
			}

			games = append(games, ps5Game)
		}
	}

	return games
}