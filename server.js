const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//middleware para verificar autenticacion
function checkAuth(req, res, next) {
  if (req.session.userId) { // Asegúrate de que estás usando el identificador correcto
      next(); // La sesión está activa, continuar
  } else {
      res.status(401).json({ status: "error", message: "No autorizado" });
  }
}

//definicion de rutas
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const pagesRoutes = require('./src/routes/pagesRoutes');

//creacion de la app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com https://unpkg.com data:;");
  next();
});

// Configuración de sesiones
app.use(session({
  secret: 'tu_secreto', // Cambia esto por un secreto seguro
  resave: false,
  saveUninitialized: true,
  saveUninitialized: true,
}));


// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', checkAuth, profileRoutes);
app.use(express.static(path.join(__dirname, './src/assets')));

// Rutas para servir las páginas
app.use('/', pagesRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Unos ecos retumban desde http://localhost:${PORT}`);
});
