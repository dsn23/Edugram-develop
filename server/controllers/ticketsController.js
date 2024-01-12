const mongoose = require('mongoose'),
  Tickets = mongoose.model('Tickets');

// Retrieve all the tasks saved in the database
const getTickets = async (req, res) => {
  Tickets.find({}, function (err, ticket) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200)
      res.json(ticket);
    }
  });
};

// Create a new ticket
const createTicket = async (req, res) => {
  const newTicket = new Tickets(req.body);
  try {
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).send(error);
  }
};


// Retrieve a task by ticketId
const getTicketById = (req, res) => {

  Tickets.findById(req.params.id, function (err, task) {
    if (err) {
      res.status(404).send({
        error: {
          errors: [{
            domain: 'global', reason: 'notFound', message: 'Not Found',
            description: 'Couldn\'t find the requested ticketId \'' + req.params.id + '\''
          }], err, code: 404
        }
      })
    } else {
      res.json(task);
    }
  });
};

// Edit a task by taskId
const editTicketById = (req, res) => {
  Tickets.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, task) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(task);
    }
  });
};

// Delete a task by taskId
const deleteTicketById = (req, res) => {
  Tickets.remove({
    _id: req.params.id
  }, function (err, task) {
    if (err) {
      res.status(404).send({
        error: {
          errors: [{
            domain: 'global', reason: 'notFound', message: 'Not Found',
            description: 'Couldn\'t find the requested ticketId \'' + req.params.id + '\''
          }], code: 404, message: 'Not Found'
        }
      })
    } else {
      res.status(204).send();
      //res.json({ message: 'Task successfully deleted' });
    }
  });
};

module.exports = {
  getTickets,
  createTicket,
  getTicketById,
  editTicketById,
  deleteTicketById
};
