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

func (r *GameRepository) GetRandomGames(count int) ([]*models.Game, error) {
    var games []*models.Game
    pipeline := []bson.M{
        {"$sample": bson.M{"size": count}},
    }
    cursor, err := r.collection.Aggregate(context.Background(), pipeline)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(context.Background())

    if err = cursor.All(context.Background(), &games); err != nil {
        return nil, err
    }
    return games, nil
}

func (r *GameRepository) GetGamesByTitle(title string) ([]*models.Game, error) {
	var games []*models.Game
	filter := bson.M{"title": bson.M{"$regex": primitive.Regex{Pattern: title, Options: "i"}}}
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var game models.Game
		if err := cursor.Decode(&game); err != nil {
			return nil, err
		}
		games = append(games, &game)
	}

	if len(games) == 0 {
		return nil, mongo.ErrNoDocuments
	}

	return games, nil
}

func (r *GameRepository) CreateGame(game *models.Game) error {
	_, err := r.collection.InsertOne(context.Background(), game)
	if err != nil {
		log.Printf("Error inserting game into database: %v", err)
	} else {
		log.Printf("Game successfully inserted: %s", game.Title)
	}
	return err
}

func (r *GameRepository) UpsertGame(game *models.Game) error {
	filter := bson.M{"title": game.Title}
	update := bson.M{"$set": game}
	opts := options.Update().SetUpsert(true)

	_, err := r.collection.UpdateOne(context.Background(), filter, update, opts)
	return err
}
