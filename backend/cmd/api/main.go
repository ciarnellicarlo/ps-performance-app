package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/database"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/repository"
	"github.com/ciarnellicarlo/ps-performance-app/backend/internal/services"
	"github.com/ciarnellicarlo/ps-performance-app/backend/pkg/igdb"
	"github.com/gorilla/handlers"
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
	gameRepo := repository.NewGameRepository(database.GetCollection("games"))
	gameService = services.NewGameService(igdbClient, gameRepo)

	// Create a new router
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/random-games", randomGamesHandler).Methods("GET")
	r.HandleFunc("/search", searchHandler).Methods("GET")

	// Set up CORS options
	corsOptions := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}), // Update with your frontend URL
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Start the server with CORS middleware
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsOptions(r)))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the PS Performance App API!")
}

func randomGamesHandler(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page == 0 {
		page = 1
	}
	count := 12 // or however many you want per page
	consoleFilter := r.URL.Query().Get("console")
	
	games, err := gameService.GetRandomGames(page, count, consoleFilter)
	if err != nil {
		log.Printf("Error getting random games: %v", err)
		http.Error(w, "Failed to get random games", http.StatusInternalServerError)
		return
	}
	
	json.NewEncoder(w).Encode(games)
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	consoleFilter := r.URL.Query().Get("console")
	if query == "" {
		http.Error(w, "Missing search query", http.StatusBadRequest)
		return
	}

	games, err := gameService.SearchGame(query, consoleFilter)
	if err != nil {
		log.Printf("Error searching for games: %v", err)
		http.Error(w, "Error searching for games", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(games)
}