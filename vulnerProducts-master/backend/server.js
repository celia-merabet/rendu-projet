const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Connexion à la base SQLite
const db = new sqlite3.Database("database.db", (err) => {
    if (err) console.error("Erreur DB:", err);
    else console.log("Base de données connectée.");
});

//  Récupérer tous les produits
app.get("/products", (req, res) => {
    const sql = "SELECT id, title, price, description, category FROM products";

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

//  Rechercher des produits (SANS injection SQL)
app.get("/products/search", (req, res) => {
    const search = req.query.q || "";

    const sql = `
        SELECT id, title, price, description, category
        FROM products
        WHERE title LIKE ? 
        OR description LIKE ?
        OR category LIKE ?
    `;

    const params = [`%${search}%`, `%${search}%`, `%${search}%`];

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Lancer le serveur
app.listen(8000, () => {
    console.log("Example app listening on port 8000");
});
