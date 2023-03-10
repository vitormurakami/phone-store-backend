const express = require("express")
const router = express.Router();
const controller = require('./controllers/clienteController')
const controllerEndereco = require('./controllers/enderecoController')

module.exports = router;

router.get("/clientes", controller.getAll)
router.post("/cliente", controller.create)
router.patch("/cliente/:id", controller.update)
router.delete("/cliente/:id", controller.delete)

router.post("/endereco", controllerEndereco.create)
router.get("/clientes/:clienteId/enderecos", controllerEndereco.getAllByCliente)
router.get("/clientes/:clienteId/enderecos/:enderecoId", controllerEndereco.getOneByClient)
router.patch("/clientes/:clienteId/enderecos/:enderecoId", controllerEndereco.update)
router.delete("/clientes/:clienteId/enderecos/:enderecoId", controllerEndereco.delete)


router.get("/health", (request, response) => {
    response.send("Up");
},)


