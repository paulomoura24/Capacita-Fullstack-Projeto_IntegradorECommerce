import express from "express"
import {route_user} from "./routers/route-user.js";
import {conn} from "./BDconnection.js";

const app = express();
app.use(express.json())

app.use(route_user)

app.listen(3333, () => console.log("Servidor rodando"))