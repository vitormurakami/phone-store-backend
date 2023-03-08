const express = require("express")
const db = require('./config/db')

const app = express.Router();

app.post("/customer", (request, response) => {

})


app.get("/clientes", async (request, response) => {
    const outputCliente = await db.query("SELECT * FROM public.cliente")
    response.send(outputCliente.rows)
})
module.exports = app;