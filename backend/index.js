import express from "express";
import mysql from "mysql2";
import cors from "cors";
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}).promise();

app.get("/api/books", async (req, res) => {
  try {
    const sql = "SELECT * FROM books"
    const [result] = await connection.query(sql)
    res.status(200).json(result);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const sql = "INSERT INTO books(`title`, `desc`, `cover`) VALUES (?, ?, ?)";
    const values = [req.body.title, req.body.desc, req.body.cover];
    const [result] = await connection.execute(sql, values);
    res.status(201).json({ message: "Book created successfully", bookId: result.insertId });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create book" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const sql = "DELETE FROM books WHERE id = ?"
    const bookId = req.params.id;
    const [result] = await connection.execute(sql, [bookId])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete book" });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const sql = "UPDATE books SET `title`= ?, `desc`= ?, `cover`= ? WHERE id = ?";
    const values = [req.body.title, req.body.desc, req.body.cover];
    const [result] = await connection.execute(sql, [...values, bookId])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book updated successfully" });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update book" });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Connected to backend.");
});