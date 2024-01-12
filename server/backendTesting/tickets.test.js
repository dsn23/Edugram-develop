const mongoose = require('mongoose');
const TicketSchema = require("../models/ticketsModal").schema
// mongoose.model('Tickets', TicketSchema);
const Tickets = mongoose.model('Tickets');
const createTicket = require("../controllers/ticketsController").createTicket;

const request = require('supertest');
const app = require('../server');
const ticketController = require('../controllers/ticketsController');

describe('GET /tickets', () => {
  // const tickets = [
  //   // .... same as in the question
  // ];
  // beforeEach(() => {
  //   // give the mock function a value
  //   // for the promise to be resolved with
  //   Tickets.find.mockResolvedValue(tickets);
  // });

});

describe('POST /createTicket', () => {

//   beforeEach(() => {
  test('it should create a new ticket', async () => {
    // create a dummy ticket to send in the request body
    const dummyTicket = {
      createdBy: 'salman.hva.nl',
      description: 'This is a test ticket',
      subject: 'Cannot Log in',
      dateCreated: "2023-01-12T22:26:33.000Z",
      status: ["Open"],
    };

    // use supertest to make a POST request to the createTicket endpoint
    const response = await request(app)
      .post('/createTicket')
      .send(dummyTicket);

    // assert that the response has a status of 201 and that the response body contains the dummy ticket
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(dummyTicket));
  });

  test('it should return an error if the ticket is not valid', async () => {
    // create a dummy ticket with missing fields
    const dummyTicket = {subject: '', description: 'This is a test ticket'};

    // use supertest to make a POST request to the createTicket endpoint
    const response = await request(app)
      .post('/createTicket')
      .send(dummyTicket)
      .catch(err => err.response);

    // assert that the response has a status of 400 and that the response body contains the error message
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message')
  });
});


module.exports = app;
