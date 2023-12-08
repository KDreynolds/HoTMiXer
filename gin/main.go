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

	r.GET("/data-table", func(c *gin.Context) {
		c.HTML(http.StatusOK, "data_table.html", gin.H{"items": data})
	})

	r.POST("/add-item", func(c *gin.Context) {
		// Add item to data
		newItem := map[string]string{
			"id":   strconv.Itoa(len(data) + 1),
			"name": c.PostForm("name"),
		}
		data = append(data, newItem)
		c.Redirect(http.StatusMovedPermanently, "/data-table")
	})

	r.GET("/edit-item-form/:id", func(c *gin.Context) {
		// Find item by id
		id := c.Param("id")
		var item map[string]string
		for _, i := range data {
			if i["id"] == id {
				item = i
				break
			}
		}
		if item == nil {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}
		c.HTML(http.StatusOK, "edit_item_form.html", gin.H{"item": item})
	})

	r.POST("/edit-item/:id", func(c *gin.Context) {
		// Find item by id and update it
		id := c.Param("id")
		for i, item := range data {
			if item["id"] == id {
				data[i]["name"] = c.PostForm("name")
				break
			}
		}
		c.Redirect(http.StatusMovedPermanently, "/data-table")
	})

	r.POST("/delete-item/:id", func(c *gin.Context) {
		// Delete item from data
		id := c.Param("id")
		for i, item := range data {
			if item["id"] == id {
				data = append(data[:i], data[i+1:]...)
				break
			}
		}
		c.Redirect(http.StatusMovedPermanently, "/data-table")
	})

	r.GET("/new_item_form", func(c *gin.Context) {
		c.HTML(http.StatusOK, "new_item_form.html", nil)
	})

	r.Run()
}
