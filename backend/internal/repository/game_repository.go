package repository

import (
	"context"
	"log"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/database"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GameRepository struct {
	collection *mongo.Collection
}

func NewGameRepository() *GameRepository {
	return &GameRepository{
		collection: database.GetCollection("games"),
	}
}

func (r *GameRepository) GetRandomGames(page, count int, consoleFilter string) ([]*models.Game, error) {
    skip := (page - 1) * count
    
    filter := bson.M{}
    if consoleFilter == "PS4" {
        filter["consoles"] = "PlayStation 4"
    } else if consoleFilter == "PS5" {
        filter["consoles"] = "PlayStation 5"
    } else {
        filter["consoles"] = bson.M{"$in": []string{"PlayStation 4", "PlayStation 5"}}
    }

    // First, count total documents matching the filter
    totalCount, err := r.collection.CountDocuments(context.Background(), filter)
    if err != nil {
        log.Printf("Error counting documents: %v", err)
        return nil, err
    }

    // If skip is greater than or equal to total count, return empty slice
    if int64(skip) >= totalCount {
        return []*models.Game{}, nil
    }

    // Adjust count if it would exceed the remaining documents
    remainingDocs := totalCount - int64(skip)
    if int64(count) > remainingDocs {
        count = int(remainingDocs)
    }

    // Use aggregation pipeline for random sampling
    pipeline := []bson.M{
        {"$match": filter},
        {"$sample": bson.M{"size": count}},
    }

    cursor, err := r.collection.Aggregate(context.Background(), pipeline)
    if err != nil {
        log.Printf("Error executing aggregation: %v", err)
        return nil, err
    }
    defer cursor.Close(context.Background())

    var games []*models.Game
    if err = cursor.All(context.Background(), &games); err != nil {
        log.Printf("Error decoding games: %v", err)
        return nil, err
    }

    log.Printf("Found %d games for page %d (filter: %s)", len(games), page, consoleFilter)
    return games, nil
}

func (r *GameRepository) GetGamesByTitle(title string, consoleFilter string) ([]*models.Game, error) {
    filter := bson.M{"title": bson.M{"$regex": primitive.Regex{Pattern: title, Options: "i"}}}
    
    if consoleFilter == "PS4" {
        filter["consoles"] = "PlayStation 4"
    } else if consoleFilter == "PS5" {
        filter["consoles"] = "PlayStation 5"
    } else {
        filter["consoles"] = bson.M{"$in": []string{"PlayStation 4", "PlayStation 5"}}
    }

    cursor, err := r.collection.Find(context.Background(), filter)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(context.Background())

    var games []*models.Game
    if err = cursor.All(context.Background(), &games); err != nil {
        return nil, err
    }

    if len(games) == 0 {
        return nil, mongo.ErrNoDocuments
    }

    return games, nil
}

func (r *GameRepository) CreateGame(game *models.Game) error {
    filter := bson.M{"title": game.Title}
    update := bson.M{"$set": game}
    opts := options.Update().SetUpsert(true)

    result, err := r.collection.UpdateOne(context.Background(), filter, update, opts)
    if err != nil {
        log.Printf("Error upserting game: %v", err)
        return err
    }

    if result.UpsertedCount > 0 {
        log.Printf("Inserted new game: %s", game.Title)
    } else if result.ModifiedCount > 0 {
        log.Printf("Updated existing game: %s", game.Title)
    } else {
        log.Printf("Game already up to date: %s", game.Title)
    }

    return nil
}

func (r *GameRepository) UpsertGame(game *models.Game) error {
	filter := bson.M{"title": game.Title}
	update := bson.M{"$set": game}
	opts := options.Update().SetUpsert(true)

	_, err := r.collection.UpdateOne(context.Background(), filter, update, opts)
	return err
}
