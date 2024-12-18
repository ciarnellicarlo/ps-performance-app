package repository

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/models"
)

type GameRepository struct {
	collection *mongo.Collection
}

func NewGameRepository(collection *mongo.Collection) *GameRepository {
	return &GameRepository{collection: collection}
}

func (r *GameRepository) UpsertGame(game *models.Game) (*models.Game, error) {
    filter := bson.M{"title": game.Title}
    update := bson.M{"$set": game}
    opts := options.FindOneAndUpdate().
        SetUpsert(true).
        SetReturnDocument(options.After)

    var result models.Game
    err := r.collection.FindOneAndUpdate(
        context.Background(),
        filter,
        update,
        opts,
    ).Decode(&result)

    if err != nil {
        return nil, err
    }

    return &result, nil
}

func (r *GameRepository) GetRandomGames(page, count int, consoleFilter string) ([]*models.Game, error) {
	skip := (page - 1) * count

	filter := bson.M{}
	if consoleFilter != "" {
		filter["platform"] = consoleFilter // Updated to use platform instead of consoles
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
	filter := bson.M{
		"title": bson.M{
			"$regex": primitive.Regex{
				Pattern: title,
				Options: "i",
			},
		},
	}

	if consoleFilter != "" {
		filter["platform"] = consoleFilter // Updated to use platform instead of consoles
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

func (r *GameRepository) GetGameByID(id string) (*models.Game, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var game models.Game
	err = r.collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&game)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No game found
		}
		return nil, err
	}

	return &game, nil
}

func (r *GameRepository) UpdateGamePerformance(gameID string, updateData map[string]interface{}) error {
    objectID, err := primitive.ObjectIDFromHex(gameID)
    if err != nil {
        return err
    }

    filter := bson.M{"_id": objectID}
    update := bson.M{"$set": updateData}

    _, err = r.collection.UpdateOne(context.Background(), filter, update)
    return err
}