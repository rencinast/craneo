const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Crear la aplicación express
const app = express();
const port = 3000;

// Crear conexión a base de datos
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

// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true si se usa https
}));

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
                        role: user.role // Asegúrate de que esto esté definido
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
    const { username, password, confirmPassword, role } = req.body; // Agregar role aquí

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

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: 'error', message: 'Error al cerrar sesión' });
        }
        res.json({ status: 'success', message: 'Sesión cerrada' });
    });
});

// Ruta para obtener la información del usuario
app.get('/get-user-info', (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ status: 'error', message: 'Nombre de usuario es requerido' });
    }

    db.query(`
        SELECT p.name, p.email, p.phone, p.address, p.extNumber, p.colonia, p.zip, p.city, p.state
        FROM users u 
        JOIN perfil p ON u.id = p.user_id 
        WHERE u.username = ?`, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ status: 'error', message: 'Error en la consulta a la base de datos' });
        }

        if (results.length > 0) {
            const userInfo = results[0];
            res.json(userInfo); // Devuelve la información del usuario en formato JSON
        } else {
            res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para actualizar el perfil
app.put('/update-profile', (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body); // Agregar esta línea
    const { user_id, name, email, phone, address, extNumber, colonia, zip, city, state } = req.body;

    // Validar que se haya proporcionado el user_id
    if (!user_id) {
        return res.status(400).json({ success: false, message: "ID del perfil es requerido." });
    }

    // Verificar que se haya proporcionado al menos un campo para actualizar
    const updates = [];
    const values = [];

    if (name) {
        updates.push('name = ?');
        values.push(name);
    }
    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (phone) {
        updates.push('phone = ?');
        values.push(phone);
    }
    if (address) {
        updates.push('address = ?');
        values.push(address);
    }
    if (extNumber) {
        updates.push('extNumber = ?');
        values.push(extNumber);
    }
    if (colonia) {
        updates.push('colonia = ?');
        values.push(colonia);
    }
    if (zip) {
        updates.push('zip = ?');
        values.push(zip);
    }
    if (city) {
        updates.push('city = ?');
        values.push(city);
    }
    if (state) {
        updates.push('state = ?');
        values.push(state);
    }

    // Verificar que se haya proporcionado al menos un campo para actualizar
    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: "No se proporcionaron campos para actualizar." });
    }

    // Agregar el user_id al final de los valores
    values.push(user_id);

    // Ejecutar la consulta
    db.query(`UPDATE perfil SET ${updates.join(', ')} WHERE user_id = ?`, values, (err, results) => {
        if (err) {
            console.error('Error al actualizar el perfil:', err);
            return res.status(500).json({ success: false, message: 'Error al actualizar el perfil', error: err.message });
        }
        res.json({ success: true, message: 'Perfil actualizado con éxito' });
    });
});

// Ruta para eliminar un usuario por ID
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL

    // Eliminar el perfil y el usuario
    db.query('DELETE FROM perfil WHERE user_id = ?', [userId], (err) => {
        if (err) {
            console.error('Error al eliminar el perfil:', err);
            return res.status(500).json({ success: false, message: 'Error al eliminar el perfil' });
        }

        db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
            if (err) {
                console.error('Error al eliminar el usuario:', err);
                return res.status(500).json({ success: false, message: 'Error al eliminar el usuario' });
            }

            res.json({ success: true, message: 'Usuario eliminado con éxito' });
        });
    });
});

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    db.query(`
        SELECT u.id AS user_id, u.username, p.name, p.email, p.phone, p.address, p.extNumber, p.colonia, p.zip, p.city, p.state
        FROM users u
        JOIN perfil p ON u.id = p.user_id
    `, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err); // Agregar log para ver el error
            return res.status(500).json({ status: 'error', message: 'Error en la consulta a la base de datos' });
        }
        res.json(results); // Devuelve todos los usuarios en formato JSON
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Unos ecos retumban desde el puerto: ${port}`);
});
