const express = require("express")
const router = express.Router();
const adminController = require('../controllers/adminController')
const jwt = require("jsonwebtoken");
const { verifyJWT } = require('../middlewares/verifyJWT');
const { checkPermission } = require("../middlewares/checkPermission");

router.post("/admin/login", adminController.login)

router.use(verifyJWT);
router.use(checkPermission('ADMIN'));

router.get("/admin/customers",  adminController.getAll)
router.get("/admin/customers/:customerId",  adminController.getCustomerById)
router.post("/admin/customers/:customerId/activate",  adminController.activateCustomer)
router.post("/admin/customers/:customerId/inactivate",  adminController.inactivateCustomer)

router.get("/health", (request, response) => {
    response.send("Up");
},)


module.exports = router;



