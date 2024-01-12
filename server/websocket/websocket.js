const mongoose = require('mongoose');
const Chat = require('../../server/models/chat');
const Message = require('../../server/models/message');
let Tickets = require('../../server/models/ticketsModal');
const {checkCookieForChat} = require("../middleware/authentication");
const io = require('socket.io')(3001)
require("dotenv").config({path: require('find-config')('.env')});
const username = process.env.DATABASE_CONNECTION_USERNAME;
const password = process.env.DATABASE_CONNECTION_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.wscvjuf.mongodb.net/Edugram?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('connected')
}).catch(err => console.log(err))

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log('user disconnected');
  });

  socket.on("get-chats", async (user) => {
    // console.log("Chats gevraagd voor: " + user.firstName + ": " + user._id);
    checkCookieForChat(socket);
    if (socket.request.role === "tutor") {
      await Chat.find({tutor: user}).then(result => {
        socket.emit("user-chats", result)
        // console.log("Gevonden chats voor tutor " + user.firstName + ": " + result);
      });
    }

    if (socket.request.role === "student")
      await Chat.find({student: user}).then(result => {
        socket.emit("user-chats", result)
        // console.log("Gevonden chats voor student " + user.firstName + ": " + result);
      });
  });

  socket.on("send-message", async (message, sender, chatId) => {
    console.log('hier begint de ellende')
    // console.log("Message sent by " + sender + " : " + message + " to chatId: " + chatId);
    await Chat.findOneAndUpdate(
      {_id: chatId},
      {$push: {messages: new Message({message: message, sender: sender, dateTime: Date.now()})}},
    );
    io.to(chatId).emit("update-chat", await Chat.findOne({_id: chatId}));
  });
  socket.on("join-chat", async (chosenChatId) => {
    console.log('join chat')
    console.log(chosenChatId)
    if (chosenChatId.length < 3) {
      console.log('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')
    } else {
      socket.join(chosenChatId);
      io.to(chosenChatId).emit("update-chat", await Chat.findOne({_id: chosenChatId}));

      // console.log("Chosen chat Id in socket: " + chosenChatId);
          // console.log(chosenChatId)
          // io.to(chosenChatId).emit("update-chat", await Chat.findOne({_id: chosenChatId.chatId}).then((result)=> {
          //   console.log(result)
          // }).catch((error)=> {
          //   console.log(error)
          // }));
    }
  })
  socket.on("delete-chat", async (chosenChatId) => {
    try {
      await Chat.deleteOne({_id: chosenChatId});
      socket.emit("chat-deleted", chosenChatId);
    } catch (err) {
      console.log(err);
    }

  })

  // const changeChatStream = Chat.watch();
  // changeChatStream.on('change', (change) => {
  //   console.log('Change detected in the tickets collection:', change);
  //
  //   // Fetch the updated data from the database
  //   Chat.find().then(result => {
  //     socket.emit('update-chat', result)
  //   });
  // });

  //This Renders at the start of visiting the page
  Tickets.find({}).then(result => {
    socket.emit('data', result)
  });

  const changeStream = Tickets.watch();
  changeStream.on('change', (change) => {
    // console.log('Change detected in the tickets collection:', change);

    // Fetch the updated data from the database
    Tickets.find().then(result => {
      socket.emit('update-tickets', result)
    });
  });

  // Notification.find({}).then(result => {
  //   console.log(result)
  //   // socket.emit('getPersonalNotification', result)
  // });
});

