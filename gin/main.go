package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")

	// Temporary data store. In a real app, this would be a database.
	data := []map[string]string{
		{"id": "1", "name": "HoTMiX"},
		{"id": "2", "name": "is"},
		{"id": "3", "name": "Horse"},
	}

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"items": data})
	})

	r.GET("/endpoint", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello, World")
	})

	r.Run()
}
