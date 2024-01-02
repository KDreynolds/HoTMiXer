const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Temporary data store. In a real app, this would be a database.
let data = [{ id: 1, name: 'HoTMiX' }, { id: 2, name: 'is' }, { id: 3, name: 'Horse' }];

app.get('/', (req, res) => {
    res.render('index', { items: data });
});

app.get('/endpoint', (req, res) => {
    res.send('Hello, World');
});

app.listen(3000, () => console.log('Server running on port 3000'));