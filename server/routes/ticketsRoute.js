const express = require('express')
const Ticket = require("../models/ticketsModal");
const router = express.Router()
const ticketList = require('../controllers/ticketsController');
const ticketController = require('../controllers/ticketsController');
const { MongoClient } = require("mongodb");

router.get("/tickets", ticketController.getTickets);
// router.get("/getById", ticketController.getTicketById);
router.post("/createTicket", ticketController.createTicket);
// router.delete("/deleteTicketId", ticketController.deleteTicketById);
// router.put("/editTicket", ticketController.deleteTicketById);

module.exports = router;
