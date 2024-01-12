const mongoose = require('mongoose'),
  Tickets = mongoose.model('TicketModel');

// Tickets.watch().on('change', next => {
//   console.log('A Change occurred:', next);
//   // io.emit('database update', next);
// });
