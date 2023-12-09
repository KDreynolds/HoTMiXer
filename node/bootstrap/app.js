const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Temporary data store. In a real app, this would be a database.
let data = [{ id: 1, name: 'HoTMiX' }, { id: 2, name: 'is' }, { id: 3, name: 'Horse' }];

app.get('/', (req, res) => {
    res.render('index', { items: data });
});

app.get('/data-table', (req, res) => {
    res.render('data_table', { items: data });
});

app.post('/add-item', (req, res) => {
    // Add item to data
    const newItem = { id: data.length + 1, name: req.body.name };
    data.push(newItem);
    res.redirect('/data-table');
});

app.get('/edit-item-form/:id', (req, res) => {
    // Find item by id
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found.');
    res.render('edit_item_form', { item: item });
});

app.post('/edit-item/:id', (req, res) => {
    // Find item by id and update it
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (item) item.name = req.body.name;
    res.redirect('/data-table');
});

app.post('/delete-item/:id', (req, res) => {
    // Delete item from data
    const index = data.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) data.splice(index, 1);
    res.redirect('/data-table');
});

app.get('/new_item_form', (req, res) => {
    res.render('new_item_form');
});

app.listen(3000, () => console.log('Server running on port 3000'));