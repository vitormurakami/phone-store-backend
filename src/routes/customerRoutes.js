const express = require("express")
const router = express.Router();
const customerController = require('../controllers/customerController')
const jwt = require("jsonwebtoken");
const { verifyJWT } = require('../middlewares/verifyJWT');
const { checkPermission } = require("../middlewares/checkPermission");

router.post("/customer/login", customerController.login);

router.use(verifyJWT);
router.use(checkPermission('CUSTOMER'));


module.exports = router;
/*






router.get("/admin/customers", checkPermission('ADMIN'), controller.getAll)
router.post("/clientes", controller.create)

router.get("/clientes/dados", controller.getOneById)
router.patch("/clientes/dados", controller.update)
router.delete("/clientes/:id", controller.delete)

router.post("/endereco", controllerEndereco.create)
router.get("/clientes/enderecos", controllerEndereco.getAllByCliente)
router.get("/clientes/enderecos/:enderecoId", controllerEndereco.getOneByClient)
router.patch("/clientes/enderecos/:enderecoId", controllerEndereco.update)
router.delete("/clientes/enderecos/:enderecoId", controllerEndereco.delete)

router.get("/health", (request, response) => {
    response.send("Up");
},)

*/
