const express = require('express');
const path = require('path');
const router = express.Router();

  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/index.html"));
  });

  router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/login.html"));
  });

  router.get("/registrarse", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/registrarse.html"));
  });

  router.get("/perfil", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/perfil.html"));
  });

  router.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/admin.html"));
  });

module.exports = router;