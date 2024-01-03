package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"items": data})
	})

	r.GET("/endpoint", func(c *gin.Context) {
		c.String(http.StatusOK, "We are so back!")
	})

	r.Run()
}
