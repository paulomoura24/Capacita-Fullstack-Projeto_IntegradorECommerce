import {Router} from "express"
import {conn} from "../BDconnection.js"

const route_user=Router()
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Página inicial');
});

app.get('/sobre', (req, res) => {
  res.send('Sobre nós');
});

app.post('/login', (req, res) => {
  
});

app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

app.listen(3000);
