const Client = require("socket.io-client");
const io = require('socket.io')(3001)
const Chat = require('../../server/models/chat');
const Message = require('../../server/models/message');
const mongoose = require("mongoose");
require("dotenv").config({path: require('find-config')('.env')});
const username = process.env.DATABASE_CONNECTION_USERNAME;
const password = process.env.DATABASE_CONNECTION_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.wscvjuf.mongodb.net/Edugram?retryWrites=true&w=majority`;

describe("Chat application", () => {
  let serverSocket, clientSocket;

  beforeAll((done) => {
    const port = 3001;
    io.on("connection", (socket) => {
      serverSocket = socket;
    });
    clientSocket = new Client(`ws://localhost:${port}`);
    clientSocket.on("connect", done);
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
      console.log('connected')
    }).catch(err => console.log(err))
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    mongoose.close();
  });

  test("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("should find chat by id", (done) => {
    serverSocket.on("chatId", async (cb) => {
      cb(await Chat.findOne({_id: "63ce70543633a9791125dbb8"}).select('tutor.firstName'));
    });
    clientSocket.emit("chatId", (arg) => {
      expect(arg).toStrictEqual({"_id": "63ce70543633a9791125dbb8", "tutor": {"firstName": "TutorTest"}});
      done();
    });
  });

  test("should find chat by tutor", (done) => {
    serverSocket.on("chatTutor", async (cb) => {
      let tutorTest = {_id: "638a5fe1ff78e2ad275c534he90d", firstName: "TutorTest"};
      cb(await Chat.findOne({tutor: tutorTest}).select('tutor.firstName'));
    });
    clientSocket.emit("chatTutor", (arg) => {
      expect(arg).toStrictEqual({"_id": "63ce70543633a9791125dbb8", "tutor": {"firstName": "TutorTest"}});
      done();
    });
  });

  test("should find chat by student", (done) => {
    serverSocket.on("chatStudent", async (cb) => {
      let studentTest = {_id: "63777665323a1dc81e681232e83", firstName: "StudentTest"};
      cb(await Chat.findOne({student: studentTest}).select('student.firstName'));
    });
    clientSocket.emit("chatStudent", (arg) => {
      expect(arg).toStrictEqual({"_id": "63ce70543633a9791125dbb8", "student": {"firstName": "StudentTest"}});
      done();
    });
  });

  test("should return null if chat doesn't exist", (done) => {
    serverSocket.on("noChat", async (cb) => {
      cb(await Chat.findOne({_id: "03ce70543633a9791125dbb8"}));
    });
    clientSocket.emit("noChat", (arg) => {
      expect(arg).toBe(null);
      done();
    });
  });

  test("send message", (done) => {
    serverSocket.on("sendMessage", async (cb) => {
      cb(await Chat.findOneAndUpdate(
        {_id: "63ce70543633a9791125dbb8"},
        {$push: {messages: new Message({message: "test", sender: "TutorTest", dateTime: Date.now()})}},
      ).select('messages'));
    });
    clientSocket.emit("sendMessage", (arg) => {
      expect(arg).toStrictEqual(expect.anything());
      done();
    });
  });

  test("remove all messages from one chat", (done) => {
    serverSocket.on("deleteMessages", async (cb) => {
      cb(await Chat.updateOne(
        {_id: "63ce70543633a9791125dbb8"},
        {$set: { messages: [] } },
        {multi: true}));
    });
    clientSocket.emit("deleteMessages", (arg) => {
      expect(arg).toStrictEqual({"acknowledged": true, "matchedCount": 1, "modifiedCount": 1, "upsertedCount": 0, "upsertedId": null});
      done();
    });
  });

});
