const express = require("express")
const router = express.Router();
const customerController = require('./controllers/customerController')
const adminController = require('./controllers/adminController')
const { verifyJWT } = require('./middlewares/verifyJWT');
const { checkPermission } = require("./middlewares/checkPermission");

router.post("/admin/login", adminController.login)
router.post("/customers/login", customerController.login);
router.post("/customers/create", customerController.create)


router.use(verifyJWT);
router.get("/admin/customers", checkPermission('ADMIN'), adminController.getAll)
router.get("/admin/customers/:customerId", checkPermission('ADMIN'), adminController.getCustomerById)
router.post("/admin/customers/:customerId/activate", checkPermission('ADMIN'), adminController.activateCustomer)
router.post("/admin/customers/:customerId/inactivate", checkPermission('ADMIN'), adminController.inactivateCustomer)

router.get("/customers/info", checkPermission('CUSTOMER'), customerController.getInfo)
router.patch("/customers/info", checkPermission('CUSTOMER'), customerController.updateInfos)

module.exports = router;