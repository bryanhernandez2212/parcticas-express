const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();


app.use(express.json());

// GET todos los usuarios
app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  res.json(users);
});

// GET usuario por ID
app.get("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const id = parseInt(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(user);
});

// POST agregar usuario
app.post("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));

  // solo agregamos el body
  users.push(req.body);

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Usuario agregado" });
});


// DELETE usuario
app.delete("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));

  // viene de ?id=1
  const id = Number(req.query.id);

  // validación básica
  if (!id) {
    return res.status(400).json({ error: "ID requerido en query (?id=)" });
  }

  const newUsers = users.filter((u) => Number(u.id) !== id);

  if (users.length === newUsers.length) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  fs.writeFileSync("users.json", JSON.stringify(newUsers, null, 2));
  res.json({ message: "Usuario eliminado" });
});

// PUT editar usuario
app.put("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const id = Number(req.query.id);

  const index = users.findIndex(
    (u) => u && Number(u.id) === id
  );

  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  users[index] = {
    ...users[index],
    ...req.body
  };

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json({ message: "Usuario actualizado" });
});

// 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
