const express = require('express');
const ecommerceRoutes = require("./routes")
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(ecommerceRoutes)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/health", (req, res) => {
    return res.json("up")
})
app.listen(3333, () => console.log("Server up in 3333"))