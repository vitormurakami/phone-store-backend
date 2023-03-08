const express = require('express');
const ecommerceRoutes = require("./routes")
const app = express()

app.use(express.json())
app.use(ecommerceRoutes)

app.get("/health", (req, res) => {
    return res.json("up")
})

app.listen(3333, () => console.log("Server up in 3333"))