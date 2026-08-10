const express = require("express");
const { identifyUser } = require("../controllers/userController.js");

const router = express.Router();

router.post("/identify", identifyUser);

module.exports = router;
