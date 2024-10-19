package services

import (
	"log"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/models"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/repository"
	"github.com/ciarnellicarlo/ps-performance-app/backend/pkg/igdb"
)

type GameService struct {
	igdbClient *igdb.Client
	gameRepo   *repository.GameRepository
	cache      map[string][]*models.Game
	cacheMutex sync.RWMutex
}

func NewGameService(igdbClient *igdb.Client, gameRepo *repository.GameRepository) *GameService {
	return &GameService{
		igdbClient: igdbClient,
		gameRepo:   gameRepo,
		cache:      make(map[string][]*models.Game),
	}
}

func (s *GameService) GetRandomGames(page, count int, consoleFilter string) ([]*models.Game, error) {
	cacheKey := fmt.Sprintf("%d-%d-%s", page, count, consoleFilter)
	
	s.cacheMutex.RLock()
	if cachedGames, ok := s.cache[cacheKey]; ok {
		s.cacheMutex.RUnlock()
		log.Printf("Returning %d cached games for page %d with filter %s", len(cachedGames), page, consoleFilter)
		return cachedGames, nil
	}
	s.cacheMutex.RUnlock()

	games, err := s.gameRepo.GetRandomGames(page, count, consoleFilter)
	if err != nil {
		log.Printf("Error fetching random games from database: %v", err)
		return nil, fmt.Errorf("error fetching random games: %w", err)
	}

	s.cacheMutex.Lock()
	s.cache[cacheKey] = games
	s.cacheMutex.Unlock()

	log.Printf("Returning %d random games for page %d with filter %s", len(games), page, consoleFilter)
	return games, nil
}

func (s *GameService) SearchGame(name string, consoleFilter string) ([]*models.Game, error) {
    log.Printf("Searching for game: %s with filter %s", name, consoleFilter)

    // First, check our database
    localGames, err := s.gameRepo.GetGamesByTitle(name, consoleFilter)
    if err == nil && len(localGames) > 0 {
        log.Printf("Found %d games in local database for query: %s", len(localGames), name)
        return localGames, nil
    }

    // If not found locally, search IGDB
    log.Printf("Game not found in local database. Searching IGDB for: %s", name)
    igdbGames, err := s.igdbClient.SearchGame(name)
    if err != nil {
        log.Printf("Error searching IGDB: %v", err)
        return nil, fmt.Errorf("error searching IGDB: %w", err)
    }

    log.Printf("IGDB returned %d games for query: %s", len(igdbGames), name)

    var allGames []*models.Game
    for _, igdbGame := range igdbGames {
        games, err := convertIGDBToGameModel(&igdbGame)
        if err != nil {
            log.Printf("Error converting IGDB game to model: %v", err)
            continue
        }
        for _, game := range games {
            log.Printf("Processing game: %s, Consoles: %v", game.Title, game.Consoles)
            
            // Save all games to the database, regardless of the filter
            err = s.gameRepo.CreateGame(game)
            if err != nil {
                log.Printf("Error saving game to MongoDB: %v", err)
            } else {
                log.Printf("Saved game to database: %s", game.Title)
            }

            // Only add to return list if it matches the filter
            if isGameMatchingFilter(game, consoleFilter) {
                allGames = append(allGames, game)
                log.Printf("Added game to results: %s", game.Title)
            } else {
                log.Printf("Game does not match filter: %s", game.Title)
            }
        }
    }

    if len(allGames) == 0 {
        log.Printf("No games found matching the search criteria: %s with filter %s", name, consoleFilter)
    } else {
        log.Printf("Found %d games matching the search criteria: %s with filter %s", len(allGames), name, consoleFilter)
    }

    return allGames, nil
}

func isGameMatchingFilter(game *models.Game, consoleFilter string) bool {
    if consoleFilter == "" {
        return true
    }
    switch consoleFilter {
    case "PS4":
        return strings.HasPrefix(game.Title, "[PS4]")
    case "PS5":
        return strings.HasPrefix(game.Title, "[PS5]")
    default:
        return true
    }
}

func contains(slice []string, item string) bool {
    for _, a := range slice {
        if a == item {
            return true
        }
    }
    return false
}

func (s *GameService) fetchGamesFromIGDB(count int) ([]igdb.Game, error) {
    igdbGames, err := s.igdbClient.GetRandomGames(count * 2) // Fetch more to account for non-PS games
    if err != nil {
        return nil, fmt.Errorf("error fetching random games from IGDB: %w", err)
    }

    var filteredGames []igdb.Game
    for _, game := range igdbGames {
        if isPSGameIGDB(game) {
            filteredGames = append(filteredGames, game)
        }
        if len(filteredGames) == count {
            break
        }
    }

    return filteredGames, nil
}

func isPSGameIGDB(game igdb.Game) bool {
    for _, platform := range game.Platforms {
        if platform.Name == "PlayStation 4" || platform.Name == "PlayStation 5" {
            return true
        }
    }
    return false
}

func convertIGDBToGameModel(igdbGame *igdb.Game) ([]*models.Game, error) {
    if igdbGame == nil {
        return nil, fmt.Errorf("nil IGDB game")
    }

    var games []*models.Game

    hasPS4Version := false
    hasPS5Version := false

    for _, platform := range igdbGame.Platforms {
        switch platform.Name {
        case "PlayStation 4":
            hasPS4Version = true
        case "PlayStation 5":
            hasPS5Version = true
        }
    }

    if hasPS4Version {
        ps4Game := &models.Game{
            Title:       fmt.Sprintf("[PS4] %s", igdbGame.Name),
            CoverArtURL: igdbGame.Cover.URL,
            Consoles:    []string{"PlayStation 4"},
            PS4:         models.ConsolePerformance{},
        }
        games = append(games, ps4Game)
    }

    if hasPS5Version {
        ps5Game := &models.Game{
            Title:       fmt.Sprintf("[PS5] %s", igdbGame.Name),
            CoverArtURL: igdbGame.Cover.URL,
            Consoles:    []string{"PlayStation 5"},
            PS5:         models.ConsolePerformance{},
        }
        games = append(games, ps5Game)
    }

    for _, game := range games {
        log.Printf("Converted IGDB game: %s, Consoles: %v", game.Title, game.Consoles)
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

func (s *GameService) ClearCachePeriodically() {
	ticker := time.NewTicker(5 * time.Minute)
	go func() {
		for range ticker.C {
			s.cacheMutex.Lock()
			s.cache = make(map[string][]*models.Game)
			s.cacheMutex.Unlock()
			log.Println("Cache cleared")
		}
	}()
}