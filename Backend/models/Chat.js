const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  senderId: { type: String, required: true },
  senderN: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const chatRoomSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    senderAvatar: { type: String, required: false },
    receiverAvatar: { type: String, required: false },
    productImage: { type: String, required: true },
    productTitle: { type: String, required: true },
    productPrice: { type: Number, required: true },
    messages: [messageSchema],
    senderMessagesNotRead: [messageSchema], 
    receiverMessagesNotRead: [messageSchema],
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;