require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // obtenemos la base de datos
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar MongoDB", error);
  }
}

connectDB();

app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});
   
/* agregar usuario */
app.post("/users", async (req, res) => {
  try {
    const result = await db.collection("users").insertOne(req.body);
    res.json({
      message: "Usuario agregado",
      id: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar usuario" });
  }
});

/* eliminar usuario */
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

/* editar usuario */
app.put("/users/:id", async (req, res) => {
  try {
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
