const express = require("express")
const router = express.Router();
const controller = require('./controllers/clienteController')

module.exports = router;

router.get("/clientes", controller.getAll)
router.post("/cliente", controller.create)
router.patch("/cliente/:id", controller.update)
router.delete("/cliente/:id", controller.delete)

router.get("/health", (request, response) => {
    response.send("Up");
},)

