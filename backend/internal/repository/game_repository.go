package repository

import (
	"context"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GameRepository struct {
	collection *mongo.Collection
}

func NewGameRepository(collection *mongo.Collection) *GameRepository {
	return &GameRepository{collection: collection}
}

func (r *GameRepository) UpsertGame(game *models.Game) error {
	filter := bson.M{"title": game.Title}
	update := bson.M{"$set": game}
	opts := options.Update().SetUpsert(true)

	_, err := r.collection.UpdateOne(context.Background(), filter, update, opts)
	return err
}

func (r *GameRepository) GetRandomGames(page, count int, consoleFilter string) ([]*models.Game, error) {
	skip := (page - 1) * count

	filter := bson.M{}
	if consoleFilter != "" {
		filter["consoles"] = consoleFilter
	}

	pipeline := []bson.M{
		{"$match": filter},
		{"$sample": bson.M{"size": count + skip}},
		{"$skip": skip},
		{"$limit": count},
	}

	cursor, err := r.collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var games []*models.Game
	if err := cursor.All(context.Background(), &games); err != nil {
		return nil, err
	}

	return games, nil
}

func (r *GameRepository) GetGamesByTitle(title string, consoleFilter string) ([]*models.Game, error) {
	filter := bson.M{"title": bson.M{"$regex": title, "$options": "i"}}
	if consoleFilter != "" {
		filter["consoles"] = consoleFilter
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var games []*models.Game
	if err := cursor.All(context.Background(), &games); err != nil {
		return nil, err
	}

	return games, nil
}
