const express = require("express")
const router = express.Router();
const controller = require('./controllers/clienteController')
const controllerEndereco = require('./controllers/enderecoController')
const jwt = require("jsonwebtoken");
const SECRET = require("./config/jwtSecret");

module.exports = router;

function verifyJWT(req, res, next){
    const token = req.headers["x-access-token"];
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).end()
        req.userId = decoded.userId;
        next();
    })
}


router.post("/login", controller.login)
router.get("/clientes", controller.getAll)
router.post("/clientes", controller.create)

router.use(verifyJWT);

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


