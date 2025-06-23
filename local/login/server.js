const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DB_PATH = path.join(__dirname, "login.json");

app.post("/login", (req, res) => {
  const { login, senha } = req.body;
  const rawData = fs.readFileSync(DB_PATH);
  const data = JSON.parse(rawData);
  const usuarios = data.users || [];

  const user = usuarios.find(u => u.login === login && u.senha === senha);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: "Usuário ou senha inválidos" });
  }
});

app.post("/cadastrar", (req, res) => {
  const novoUsuario = req.body;

  if (!novoUsuario.login || !novoUsuario.senha) {
    return res.status(400).json({ error: "Login e senha são obrigatórios." });
  }

  const rawData = fs.readFileSync(DB_PATH);
  const data = JSON.parse(rawData);
  const usuarios = data.users || [];

  const usuarioExistente = usuarios.find(u => u.login === novoUsuario.login);
  if (usuarioExistente) {
    return res.status(400).json({ error: "Usuário já existe." });
  }

  const novoId = Date.now();
  const usuarioComId = {
    ...novoUsuario,
    id: novoId,
    created_at: new Date().toISOString(),
    planId: null
  };

  usuarios.push(usuarioComId);
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: usuarios }, null, 2));

  res.status(201).json(usuarioComId);
});


const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
