package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/database"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/repository"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/services"
	"github.com/ciarnellicarlo/ps-performance-app/backend/pkg/igdb"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var gameService *services.GameService

func main() {
	// Load .env file
	envPath := filepath.Join("..", "..", ".env")
	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: .env file not found in %s", envPath)
	}

	// Initialize IGDB client
	clientID := os.Getenv("TWITCH_CLIENT_ID")
	clientSecret := os.Getenv("TWITCH_CLIENT_SECRET")
	if clientID == "" || clientSecret == "" {
		log.Fatal("TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set in .env file")
	}
	igdbClient := igdb.NewClient(clientID, clientSecret)

	// Connect to MongoDB
	database.ConnectToMongoDB()

	// Initialize repository and service
	gameRepo := repository.NewGameRepository()
	gameService = services.NewGameService(igdbClient, gameRepo)

	// Create a new router
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/search", searchHandler).Methods("GET")

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the PS Performance App API!")
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Missing search query", http.StatusBadRequest)
		return
	}

	games, err := gameService.SearchGame(query)
	if err != nil {
		log.Printf("Error searching for games: %v", err)
		http.Error(w, "Error searching for games", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(games)
}
