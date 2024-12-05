const express = require('express');
const path = require('path');
const router = express.Router();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/index.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/login.html'));
})

app.get('/registrarse', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/registrarse.html'));
})

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/perfil.html'));
})

module.exports = router;