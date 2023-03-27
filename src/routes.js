const express = require("express")
const router = express.Router();
const customerController = require('./controllers/customerController')
const adminController = require('./controllers/adminController')
const addressController = require("./controllers/addressController")
const cardController = require('./controllers/cardController')
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

router.put("/customers/password", checkPermission('CUSTOMER'), customerController.updatePassword)

router.get("/customers/address", checkPermission("CUSTOMER"), addressController.getAll)
router.get("/customers/address/:addressId", checkPermission("CUSTOMER"), addressController.getAddressById)
router.post("/customers/address", checkPermission("CUSTOMER"), addressController.create)
router.patch("/customers/address/:addressId", checkPermission("CUSTOMER"), addressController.update)
router.delete("/customers/address/:addressId", checkPermission("CUSTOMER"), addressController.delete)

router.get("/customers/cards", checkPermission("CUSTOMER"), cardController.getAll)
router.post("/customers/cards", checkPermission("CUSTOMER"), cardController.create)
router.patch("/customers/cards/:cardId", checkPermission("CUSTOMER"), cardController.update)
router.delete("/customers/cards/:cardId", checkPermission("CUSTOMER"), cardController.delete)

module.exports = router;