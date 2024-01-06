<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HoTMiXer!</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/style.css') }}">
    <script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous"></script>
</head>
<body>
    <img src="{{ asset('images/hotmix_logo.png') }}" alt="HotMiX Logo">
    <h1>Welcome to HoTMiXer!</h1>
    <p>Edit templates/index.html to start building your application.</p>
    <div id="update-div">
        It is so over...
    </div>
    <button hx-get="/endpoint" hx-trigger="click" hx-target="#update-div" hx-swap="outerHTML">
        Click Me!
    </button>
    <div class="link-container">
        <a href="https://htmx.org/docs/" target="_blank">Learn more about HTMX</a>
        <a href="https://flask.palletsprojects.com/en/3.0.x/" target="_blank">Learn more about Flask</a>
    </div>
</body>
</html>