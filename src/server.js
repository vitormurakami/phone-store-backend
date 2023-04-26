const express = require('express');
const routes = require("./routes")
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(routes)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3333, () => console.log("Server up in 3333"))