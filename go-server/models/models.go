package models

import (
	"fmt"
	"log"

	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	ID          string `gorm:"type:uuid;" json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
	OrderIndex  int    `json:"orderIndex"`
}

func (task *Task) BeforeCreate(tx *gorm.DB) (err error) {
	task.ID = uuid.New().String()
	return
}

var Database *gorm.DB

func init() {
	var err error
	Database, err = gorm.Open(sqlite.Open("database.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	err = Database.AutoMigrate(&Task{})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to SQLite and table created!")
}
