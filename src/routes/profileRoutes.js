const express = require("express");
const db = require("../../config/db"); // Importar la conexión a la base de datos
const router = express.Router();

  // Ruta para obtener la información del usuario
  router.get("/get-user-info", (req, res) => {
    const username = req.query.username;

    if (!username) {
      return res
        .status(400)
        .json({ status: "error", message: "Nombre de usuario es requerido" });
    }

    db.query(
      `
        SELECT p.name, p.email, p.phone, p.address, p.extNumber, p.colonia, p.zip, p.city, p.state
        FROM users u 
        JOIN perfil p ON u.id = p.user_id 
        WHERE u.username = ?`,
      [username],
      (err, results) => {
        if (err) {
          console.error("Error en la consulta:", err);
          return res.status(500).json({
            status: "error",
            message: "Error en la consulta a la base de datos",
          });
        }

        if (results.length > 0) {
          const userInfo = results[0];
          res.json(userInfo); // Devuelve la información del usuario en formato JSON
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Usuario no encontrado" });
        }
      }
    );
  });

  // Ruta para actualizar el perfil
  router.put("/update-profile", (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body);
    const {
      user_id,
      name,
      email,
      phone,
      address,
      extNumber,
      colonia,
      zip,
      city,
      state,
    } = req.body;

    // Validar que se haya proporcionado el user_id
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "ID del perfil es requerido." });
    }

    // Verificar que el número exterior tenga entre 1 y 10 dígitos
    if (extNumber && (extNumber.length < 1 || extNumber.length > 10)) {
      return res.status(400).json({
        success: false,
        message: "El número exterior debe tener entre 1 y 10 dígitos.",
      });
    }

    // Verificar que el número exterior sea un número válido
    if (extNumber && !/^\d+$/.test(extNumber)) {
      return res.status(400).json({
        success: false,
        message: "El número exterior debe ser un número válido.",
      });
    }

    // Verificar que se haya proporcionado al menos un campo para actualizar
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (address) {
      updates.push("address = ?");
      values.push(address);
    }
    if (extNumber) {
      updates.push("extNumber = ?");
      values.push(extNumber);
    }
    if (colonia) {
      updates.push("colonia = ?");
      values.push(colonia);
    }
    if (zip) {
      updates.push("zip = ?");
      values.push(zip);
    }
    if (city) {
      updates.push("city = ?");
      values.push(city);
    }
    if (state) {
      updates.push("state = ?");
      values.push(state);
    }

    // Verificar que se haya proporcionado al menos un campo para actualizar
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar.",
      });
    }

    // Agregar el user_id al final de los valores
    values.push(user_id);

    // Ejecutar la consulta
    db.query(
      `UPDATE perfil SET ${updates.join(", ")} WHERE user_id = ?`, values,
      (err, results) => {
        if (err) {
          console.error("Error al actualizar el perfil:", err);
          return res.status(500).json({
            success: false,
            message: "Error al actualizar el perfil",
            error: err.message,
          });
        }
        res.json({ success: true, message: "Perfil actualizado con éxito" });
      }
    );
  });

  // Ruta para cerrar sesión
  router.post("/logout", (req, res) => {
    console.log("Cerrando sesión para el usuario:", req.session.userId); // Verifica si el userId está presente
    if (!req.session.userId) {
        return res.status(401).json({ status: "error", message: "No autorizado" });
    }
    req.session.destroy((err) => {
        if (err) {
            return res.json({ status: "error", message: "Error al cerrar sesión" });
        }
        console.log("Sesión cerrada exitosamente");
        res.json({ status: "success", message: "Sesión cerrada" });
    });
});


module.exports = router;
