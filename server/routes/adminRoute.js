const express = require('express')
const Ticket = require("../models/ticketsModal");
const router = express.Router()
const adminController = require('../controllers/adminController');
const { MongoClient } = require("mongodb");

router.get("/getUsers", adminController.getUsers());
router.post("/block-user", adminController.blockUser());
router.post("/edit-profile", adminController.editProfile());

module.exports = router;
