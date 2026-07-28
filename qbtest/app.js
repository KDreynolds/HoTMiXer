const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/endpoint', (req, res) => {
    res.send('We are so back!');
});

app.listen(3000, () => console.log('Server running on port 3000'));