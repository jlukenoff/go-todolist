package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"

	"go-server/models"
)

var db *gorm.DB

func init() {
	db = models.Database
}

// GetAllTask get all the task route
func GetAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	payload := getAllTask()
	json.NewEncoder(w).Encode(payload)
}

// CreateTask create task route
func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var task models.Task
	_ = json.NewDecoder(r.Body).Decode(&task)
	insertOneTask(task)
	json.NewEncoder(w).Encode(task)
}

// TaskComplete update task route
func TaskComplete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	taskComplete(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

// UndoTask undo the complete task route
func UndoTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	undoTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

// DeleteTask delete one task route
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	deleteOneTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

// DeleteAllTask delete all tasks route
func DeleteAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	count := deleteAllTask()
	json.NewEncoder(w).Encode(count)
}

// get all task from the DB and return it
func getAllTask() []models.Task {
	var tasks []models.Task
	result := db.Find(&tasks)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	return tasks
}

// Insert one task in the DB
func insertOneTask(task models.Task) {
	result := db.Create(&task)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	fmt.Println("Inserted a Single Record")
}

// task complete method, update task's status to true
func taskComplete(taskID string) {
	result := db.Model(&models.Task{}).Where("id = ?", taskID).Update("status", true)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	fmt.Println("Task marked as complete")
}

// task undo method, update task's status to false
func undoTask(taskID string) {
	result := db.Model(&models.Task{}).Where("id = ?", taskID).Update("status", false)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	fmt.Println("Task marked as incomplete")
}

// delete one task from the DB, delete by ID
func deleteOneTask(taskID string) {
	result := db.Delete(&models.Task{}, taskID)
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	fmt.Println("Deleted a Single Record")
}

// delete all the tasks from the DB
func deleteAllTask() int64 {
	result := db.Exec("DELETE FROM tasks")
	if result.Error != nil {
		log.Fatal(result.Error)
	}
	rowsAffected := result.RowsAffected
	fmt.Println("Deleted all tasks")
	return rowsAffected
}
