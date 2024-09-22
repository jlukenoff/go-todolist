package router

import (
	"go-server/controllers"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/api/task", controllers.GetAllTask).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/task", controllers.CreateTask).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/task/{id}", controllers.TaskComplete).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/undoTask/{id}", controllers.UndoTask).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/task/{id}", controllers.DeleteTask).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/task/all", controllers.DeleteAllTask).Methods("DELETE", "OPTIONS")

	// Static file server
	staticDir := "../client/dist"
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(staticDir))))

	// Catch-all route to serve index.html for SPA
	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
	})

	return router
}
