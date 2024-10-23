package models

// Platform represents the native platform of a game
type Platform string

const (
    PS4 Platform = "PlayStation 4"
    PS5 Platform = "PlayStation 5"
)

// ConsoleType represents the specific console variant
type ConsoleType string

const (
	PS4Base ConsoleType = "PS4"
	PS4Pro  ConsoleType = "PS4 Pro"
	PS5Base ConsoleType = "PS5"
	PS5Pro  ConsoleType = "PS5 Pro"
)

// GetCompatibleConsoles returns the compatible console types for a given platform
func GetCompatibleConsoles(platform Platform) []ConsoleType {
	switch platform {
	case PS4:
		return []ConsoleType{PS4Base, PS4Pro, PS5Base, PS5Pro}
	case PS5:
		return []ConsoleType{PS5Base, PS5Pro}
	default:
		return []ConsoleType{}
	}
}