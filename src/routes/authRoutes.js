const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Importar la conexión a la base de datos
const router = express.Router();

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error en la consulta a la base de datos' });
        }

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.pswd, (err, isMatch) => {
                if (isMatch) {
                    // Enviar el ID del usuario y el rol en la respuesta
                    res.json({
                        status: 'success',
                        message: 'Inicio de sesión exitoso',
                        username: user.username,
                        userId: user.id,
                        role: user.role
                    });
                } else {
                    res.json({ status: 'error', message: 'Contraseña incorrecta' });
                }
            });
        } else {
            res.json({ status: 'error', message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para registrar un nuevo usuario
app.post('/registrar', (req, res) => {
    const { username, password, confirmPassword, role } = req.body;

    // Validar que el usuario y la contraseña no estén vacíos
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son requeridos.' });
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Las contraseñas no coinciden.' });
    }

    // Verificar si el nombre de usuario ya existe
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error en la consulta a la base de datos' });
        }

        if (results.length > 0) {
            return res.status(400).json({ status: 'error', message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar la contraseña y registrar el usuario
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Error al encriptar la contraseña' });
            }

            // Insertar el nuevo usuario en la base de datos con el rol
            db.query('INSERT INTO users (username, pswd, role) VALUES (?, ?, ?)', [username, hashedPassword, role || 'user'], (err, results) => {
                if (err) {
                    return res.status(500).json({ status: 'error', message: 'Error al registrar el usuario' });
                }

                const userId = results.insertId; // Obtener el ID del nuevo usuario

                // Insertar en la tabla perfil con el user_id y valores NULL
                db.query('INSERT INTO perfil (user_id, name, email, phone, address, extNumber, colonia, zip, city, state) VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', [userId], (err) => {
                    if (err) {
                        console.error('Error al insertar en perfil:', err); // Agregar este log
                        return res.status(500).json({ status: 'error', message: 'Error al crear el perfil' });
                    }

                    res.json({ status: 'success', message: 'Usuario registrado con éxito' }); // Respuesta de éxito
                });
            });
        });
    });
});

module.exports = router;