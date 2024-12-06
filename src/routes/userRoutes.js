const express = require("express");
const db = require("../../config/db"); // Importar la conexión a la base de datos
const router = express.Router();

  // Ruta para obtener todos los usuarios
  router.get("/usuarios", (req, res) => {
    db.query(
      `
        SELECT u.id AS user_id, u.username, p.name, p.email, p.phone, p.address, p.extNumber, p.colonia, p.zip, p.city, p.state
        FROM users u
        JOIN perfil p ON u.id = p.user_id
    `,
      (err, results) => {
        if (err) {
          console.error("Error en la consulta:", err);
          return res
            .status(500)
            .json({
              status: "error",
              message: "Error en la consulta a la base de datos",
            });
        }
        res.json(results); // Devuelve todos los usuarios en formato JSON
      }
    );
  });

  // Ruta para eliminar un usuario por ID
  router.delete("/usuario/:id", (req, res) => {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL

    // Eliminar el perfil y el usuario
    db.query("DELETE FROM perfil WHERE user_id = ?", [userId], (err) => {
      if (err) {
        console.error("Error al eliminar el perfil:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error al eliminar el perfil" });
      }

      db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) {
          console.error("Error al eliminar el usuario:", err);
          return res
            .status(500)
            .json({ success: false, message: "Error al eliminar el usuario" });
        }

        res.json({ success: true, message: "Usuario eliminado con éxito" });
      });
    });
  });


module.exports = router;
