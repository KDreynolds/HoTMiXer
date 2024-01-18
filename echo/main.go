package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/static", "static")

	e.GET("/", func(c echo.Context) error {
		return c.File("templates/index.html")
	})

	e.GET("/endpoint", func(c echo.Context) error {
		return c.String(http.StatusOK, "We are so back!")
	})

	e.Start(":8080")
}
