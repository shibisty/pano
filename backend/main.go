package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type Response struct {
	Page       string `json:"page"`
	Title      string `json:"title"`
	TilesPath  string `json:"tiles_path,omitempty"`
}

type I18n map[string]string

func loadLocale(lang string) I18n {
	filePath := "src/translations/" + lang + ".json"

	data, err := os.ReadFile(filePath)
	if err != nil {
		// fallback на en
		data, err = os.ReadFile("src/translations/en.json")
		if err != nil {
			log.Fatal("Cannot load default locale")
		}
	}

	var dict I18n
	json.Unmarshal(data, &dict)

	return dict
}

func jsonResponse(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	Lang := "en"
	T := loadLocale(Lang)

	jsonResponse(w, Response{
		Page:  "home",
		Title: T["home"],
	})s
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	Lang := "en"
	T := loadLocale(Lang)

	jsonResponse(w, Response{
		Page:  "about",
		Title: T["about"],
	})
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		path := r.URL.Path

		log.Printf("Request: %s %s", r.Method, path)

		switch path {
			case "/":
				indexHandler(w, r)

			case "/about":
				aboutHandler(w, r)
		}
	})

	log.Println("Server: http://localhost:8000")

	log.Fatal(http.ListenAndServe(":8000", mux))
}