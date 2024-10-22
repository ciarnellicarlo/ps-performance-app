package models

import ("go.mongodb.org/mongo-driver/bson/primitive")

type Performance struct {
	FPS        int    `json:"fps" bson:"fps"`
	Resolution string `json:"resolution" bson:"resolution"`
}

type ConsolePerformance struct {
	HasGraphicsSettings *bool        `json:"hasGraphicsSettings" bson:"hasGraphicsSettings"` // Renamed and always present
	FidelityMode       *Performance `json:"fidelityMode,omitempty" bson:"fidelityMode,omitempty"`
	PerformanceMode    *Performance `json:"performanceMode,omitempty" bson:"performanceMode,omitempty"`
	StandardMode       *Performance `json:"standardMode,omitempty" bson:"standardMode,omitempty"`
}

type Game struct {
	ID                primitive.ObjectID           `json:"id,omitempty" bson:"_id,omitempty"`
	Title            string                       `json:"title" bson:"title"`
	CoverArtURL      string                       `json:"coverArtURL" bson:"coverArtURL"`
	ReleaseYear      int                          `json:"releaseYear" bson:"releaseYear"`
	Platform         Platform                     `json:"platform" bson:"platform"`
	CompatibleConsoles map[ConsoleType]ConsolePerformance `json:"compatibleConsoles" bson:"compatibleConsoles"`
}

// NewEmptyConsolePerformance creates a new ConsolePerformance instance with undefined graphics mode
func NewEmptyConsolePerformance() ConsolePerformance {
	return ConsolePerformance{
		HasGraphicsSettings: nil,  // Explicitly set to nil to show it's undefined
		FidelityMode: &Performance{
			FPS:        0,
			Resolution: "",
		},
		PerformanceMode: &Performance{
			FPS:        0,
			Resolution: "",
		},
		StandardMode: &Performance{
			FPS:        0,
			Resolution: "",
		},
	}
}