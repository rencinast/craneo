const mysql = require('mysql2');
require('dotenv').config();

// Crear conexión a base de datos con un archivo .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
// Validación de conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.log("Error de conexión a la base de datos", err);
        return;
    }
    console.log("Conexión exitosa");
});

module.exports = db;