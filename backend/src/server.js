import express from "express"
import {route_user} from "./routers/route-user.js";
import {conn} from "./BDconnection.js";


const express = require('express');
const prisma = require('./prismaClient');
const app = express();
app.use(express.json());
app.use(route_user)

// rota para criar usuário
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    // tratamento de erro (ex: email já existe)
    res.status(400).json({ error: error.message });
  }
});

// rota para listar usuários
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// rota para buscar usuário pelo ID
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
  } else {
    res.json(user);
  }
});

// rota para atualizar usuário
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// rota para deletar usuário
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
