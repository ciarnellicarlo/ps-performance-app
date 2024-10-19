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
		baseGame := &models.Game{
			Title:       igdbGame.Name,
			CoverArtURL: igdbGame.Cover.URL,
			ReleaseYear: time.Unix(int64(igdbGame.FirstRelease), 0).Year(),
		}

		hasPS4, hasPS5 := false, false
		for _, platform := range igdbGame.Platforms {
			if platform.Name == "PlayStation 4" {
				hasPS4 = true
			} else if platform.Name == "PlayStation 5" {
				hasPS5 = true
			}
		}

		if hasPS4 && (consoleFilter == "" || consoleFilter == "PS4") {
			ps4Game := *baseGame
			ps4Game.Title = fmt.Sprintf("[PS4] %s", ps4Game.Title)
			ps4Game.Consoles = []string{"PlayStation 4"}
			ps4Game.PS4 = models.ConsolePerformance{}
			games = append(games, &ps4Game)
		}

		if hasPS5 && (consoleFilter == "" || consoleFilter == "PS5") {
			ps5Game := *baseGame
			ps5Game.Title = fmt.Sprintf("[PS5] %s", ps5Game.Title)
			ps5Game.Consoles = []string{"PlayStation 5"}
			ps5Game.PS5 = models.ConsolePerformance{}
			games = append(games, &ps5Game)
		}
	}

	return games
}