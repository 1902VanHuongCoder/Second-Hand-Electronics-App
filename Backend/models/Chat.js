const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({ // This collection is used to store the message of the chat room
  text: { type: String, required: true }, // Message content
  senderId: { type: String, required: true }, // Sender ID
  senderN: { type: String, required: true }, // Sender name
  time: { type: Date, default: Date.now } // Time when the message is sent
});

const chatRoomSchema = new mongoose.Schema({ 
    roomCode: { type: String, required: true }, // Room code 
    senderId: { type: String, required: true }, // Sender ID to identify who send the message 
    receiverId: { type: String, required: true }, // Receiver ID to identify who receive the message
    senderName: { type: String, required: true }, // Sender name
    receiverName: { type: String, required: true }, // Receiver name
    senderAvatar: { type: String, required: false }, // Sender avatar
    receiverAvatar: { type: String, required: false }, // Receiver avatar
    productImage: { type: String, required: true }, // Product image
    productTitle: { type: String, required: true }, // Product title
    productPrice: { type: Number, required: true }, // Product price
    messages: [messageSchema], // List of messages
    senderMessagesNotRead: [messageSchema],  // List of messages that sender has not read
    receiverMessagesNotRead: [messageSchema], // List of messages that receiver has not read
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;