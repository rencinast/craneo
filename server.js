const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const pageRoutes = require('./src/routes/pageRoutes'); // Importar las rutas de páginas
const db = require('./config/db'); // Importar la conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);

// Rutas para servir las páginas
app.use('/', pageRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Unos ecos retumban desde http://localhost:${PORT}`);
});
