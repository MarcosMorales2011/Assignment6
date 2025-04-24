const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./data/db.sqlite');

// Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
)`);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/api/add-user', (req, res) => {
    const { name, age } = req.body;
    db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, [name, age], function(err) {
        if (err) return res.status(500).send('DB error');
        return res.json({ id: this.lastID, name, age });
    });
});

app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return res.status(500).send('DB error');
        res.json(rows);
    });
});

// Server
app.listen(3000, () => console.log('App running on http://localhost:3000'));
