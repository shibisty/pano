package main

import (
	"html/template"
	"log"
	"net/http"
	"strings"
	"os"
	"encoding/json"
)

var templates = template.Must(template.ParseFiles(
	"src/views/layout.html",
	"src/views/index.html",
	"src/views/about.html",
	"src/views/map.html",
))

type PageData struct {
	Title string
	Tiles_path  string
	JS    string
	CSS   string
}

type Manifest struct {
	JS  string `json:"js"`
	CSS string `json:"css"`
}

var manifest Manifest

func loadManifest() {
	data, err := os.ReadFile("public/manifest.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(data, &manifest)
}

func render(w http.ResponseWriter, tmpl string, data any) {
	t, err := template.ParseFiles(
		"src/views/layout.html",
		"src/views/"+tmpl,
	)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	err = t.ExecuteTemplate(w, "layout", data)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func notFound(w http.ResponseWriter) {
	t, err := template.ParseFiles(
		"src/views/layout.html",
		"src/views/404.html",
	)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	t.ExecuteTemplate(w, "layout", PageData{
		Title: "404 - Page Not Found",
		JS:    manifest.JS,
		CSS:   manifest.CSS,
	})
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	render(w, "index.html", PageData{
		Title: "Главная",
		JS:    manifest.JS,
		CSS:   manifest.CSS,
	})
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	render(w, "about.html", PageData{
		Title: "О сайте",
		JS:    manifest.JS,
		CSS:   manifest.CSS,
	})
}

func slugHandler(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(r.URL.Path, "/")
	if slug == "" {
		http.NotFound(w, r)
		return
	}

	render(w, "map.html", PageData{
		Title: "WebGL Tile Map",
		JS:    manifest.JS,
		CSS:   manifest.CSS,
		Tiles_path:  slug,
	})
}

func main() {
	mux := http.NewServeMux()

	loadManifest()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		log.Printf("Request: %s %s", r.Method, path)

		switch path {
			case "/":
				indexHandler(w, r)
			case "/about":
				aboutHandler(w, r)
			default:
				slugHandler(w, r)
		}
	})

	mux.Handle("/static/",
		http.StripPrefix("/static/",
			http.FileServer(http.Dir("public")),
		),
	)

	log.Println("Server: http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", mux))
}
