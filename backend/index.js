import express from "express";
import mysql from "mysql2";
import cors from "cors";
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Connected to backend.");
});