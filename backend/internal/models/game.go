package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Performance struct {
	FPS        int    `json:"fps" bson:"fps"`
	Resolution string `json:"resolution" bson:"resolution"`
}

type ConsolePerformance struct {
	HasGraphicsMode bool        `json:"hasGraphicsMode" bson:"hasGraphicsMode"`
	FidelityMode    Performance `json:"fidelityMode,omitempty" bson:"fidelityMode,omitempty"`
	PerformanceMode Performance `json:"performanceMode,omitempty" bson:"performanceMode,omitempty"`
	StandardMode    Performance `json:"standardMode,omitempty" bson:"standardMode,omitempty"`
}

type Game struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	CoverArtURL string             `json:"coverArtURL" bson:"coverArtURL"`
	ReleaseYear int                `json:"releaseYear" bson:"releaseYear"`
	Consoles    []string           `json:"consoles" bson:"consoles"`
	PS4         ConsolePerformance `json:"ps4" bson:"ps4"`
	PS4Pro      ConsolePerformance `json:"ps4Pro" bson:"ps4Pro"`
	PS5         ConsolePerformance `json:"ps5" bson:"ps5"`
	PS5Pro      ConsolePerformance `json:"ps5Pro" bson:"ps5Pro"`
}
