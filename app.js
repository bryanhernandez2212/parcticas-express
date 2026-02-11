require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

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
    const user = {
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
    };

    const result = await db.collection("users").insertOne(user);

    res.status(201).json({
      message: "Usuario agregado",
      id: result.insertedId
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

/* Productos */

app.post("/products", async (req, res) => {
  try {
    const product = {
      id: uuidv4(),                 
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      imgUrl: req.body.imgUrl,
      categories: req.body.categories,
      options: req.body.options,
    };

    const result = await db.collection("products").insertOne(product);

    res.status(201).json({
      message: "Producto creado correctamente",
      product: {
        id: product.id,
        _id: result.insertedId
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await db.collection("products").findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

/* compras */

/* ver compras */
app.get("/purchases", async (req, res) => {
  try {
    const result = await db.collection("purchases").find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener compras" });
  }
});

app.get("/purchases/:id", async (req, res) => {
  try {
    const purchase = await db.collection("purchases").findOne({ id: req.params.id });
    if (!purchase) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener compra" });
  }
});

/* agregar compra */
app.post("/purchases", async (req, res) => {
  try {
    const purchase = {
      id: uuidv4(),                           
      UserID: new ObjectId(req.body.UserID),  
      Products: req.body.Products,            
      Date: new Date().toISOString().split("T")[0],                      
    };

    const result = await db.collection("purchases").insertOne(purchase);

    res.status(201).json({
      message: "Compra registrada",
      id: purchase.id,
      result: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la compra" });
  }
});

/* eliminar compra */
app.delete("/purchases/:id", async (req, res) => {
  try {
    const result = await db.collection("purchases").deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    res.json({ message: "Compra eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la compra" });
  }
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
