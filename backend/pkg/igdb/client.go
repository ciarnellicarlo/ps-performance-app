package igdb

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
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

func NewClient(clientID, clientSecret string) *Client {
	return &Client{
		clientID:     clientID,
		clientSecret: clientSecret,
		http:         &http.Client{},
	}
}

type Game struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	Summary      string `json:"summary,omitempty"`
	FirstRelease int    `json:"first_release_date,omitempty"`
	Cover        struct {
		URL string `json:"url,omitempty"`
	} `json:"cover"`
	Platforms []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"platforms"`
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

func (c *Client) GetRandomGames(page, count int) ([]Game, error) {
    offset := (page - 1) * count
    query := fmt.Sprintf(`
        fields name,summary,first_release_date,cover.url,platforms.name;
        where platforms = (48,167);
        sort popularity desc;
        limit %d;
        offset %d;
    `, count, offset)

    return c.executeQuery(query)
}

func (c *Client) SearchGame(name string) ([]Game, error) {
    query := fmt.Sprintf(`
        fields name,summary,first_release_date,cover.url,platforms.name;
        search "%s";
        limit 10;
    `, name)

    return c.executeQuery(query)
}

func (c *Client) executeQuery(query string) ([]Game, error) {
    if err := c.getAccessToken(); err != nil {
        return nil, err
    }

    url := fmt.Sprintf("%s/games", baseURL)

    req, err := http.NewRequest("POST", url, strings.NewReader(query))
    if err != nil {
        return nil, fmt.Errorf("error creating request: %v", err)
    }

    req.Header.Set("Client-ID", c.clientID)
    req.Header.Set("Authorization", "Bearer "+c.accessToken)
    req.Header.Set("Accept", "application/json")
    req.Header.Set("Content-Type", "text/plain")

    resp, err := c.http.Do(req)
    if err != nil {
        return nil, fmt.Errorf("error making request: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := ioutil.ReadAll(resp.Body)
        return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
    }

    var games []Game
    if err := json.NewDecoder(resp.Body).Decode(&games); err != nil {
        return nil, fmt.Errorf("error decoding response: %v", err)
    }

    return games, nil
}