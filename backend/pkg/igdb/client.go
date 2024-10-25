package igdb

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
	"log"
)

const (
	baseURL         = "https://api.igdb.com/v4"
	twitchTokenURL  = "https://id.twitch.tv/oauth2/token"
	tokenExpiration = 24 * time.Hour
)

type Client struct {
	clientID     string
	clientSecret string
	accessToken  string
	tokenExpiry  time.Time
	http         *http.Client
}

type Game struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	FirstRelease int    `json:"first_release_date,omitempty"`
	Cover        struct {
		URL string `json:"url,omitempty"`
	} `json:"cover"`
	Platforms []struct {
		Name string `json:"name"`
	} `json:"platforms"`
}

func NewClient(clientID, clientSecret string) *Client {
	return &Client{
		clientID:     clientID,
		clientSecret: clientSecret,
		http:         &http.Client{},
	}
}

func (c *Client) getAccessToken() error {
	if c.accessToken != "" && time.Now().Before(c.tokenExpiry) {
		return nil
	}

	url := fmt.Sprintf("%s?client_id=%s&client_secret=%s&grant_type=client_credentials",
		twitchTokenURL, c.clientID, c.clientSecret)

	resp, err := c.http.Post(url, "application/json", nil)
	if err != nil {
		return fmt.Errorf("error getting access token: %v", err)
	}
	defer resp.Body.Close()

	var result struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return fmt.Errorf("error decoding access token response: %v", err)
	}

	c.accessToken = result.AccessToken
	c.tokenExpiry = time.Now().Add(time.Duration(result.ExpiresIn) * time.Second)

	return nil
}

func (c *Client) SearchGames(name string, isRandom bool) ([]Game, error) {
	if err := c.getAccessToken(); err != nil {
		return nil, fmt.Errorf("error getting access token: %w", err)
	}

	url := fmt.Sprintf("%s/games", baseURL)
	query := fmt.Sprintf(`
		search "%s";
		fields name,category,first_release_date,cover.url,platforms.name;
		where platforms = (48,167) & category = (0,8,9) & version_parent = null;
		limit 50;
	`, name)

	log.Printf("IGDB Query: %s", query)

	req, err := http.NewRequest("POST", url, strings.NewReader(query))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Client-ID", c.clientID)
	req.Header.Set("Authorization", "Bearer "+c.accessToken)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "text/plain")

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	log.Printf("IGDB Response: %s", string(body))

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	var games []Game
	if err := json.Unmarshal(body, &games); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	log.Printf("Parsed %d games from IGDB", len(games))

	return games, nil
}