const router = require("express").Router();
const ctrl = require("../controllers/users.controller");

router.get("/", ctrl.getAllUsers);
router.post("/", ctrl.createUser);
router.get("/:id", ctrl.getUserById);
router.put("/:id", ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);

module.exports = router;