const firebase = require('firebase');
const initChat = require('./chat-init');
const sendMessage = require('./send-message');
const receiveMessage = require('./receive-message');
const setIsTypingStatus = require('./set-typing-status');
const getIsTypingStatus = require('./get-typing-status');
const getRecentChatList = require('./recent-chat-list');

function FirebaseChat(config) {
    
    this.app = firebase.initializeApp(config);
    this.db = this.app.database();
    this.initChat = initChat;
    this.sendMessage = sendMessage;
    this.receiveMessage = receiveMessage;
    this.setIsTypingStatus = setIsTypingStatus;
    this.getIsTypingStatus = getIsTypingStatus;
    this.getRecentChatList = getRecentChatList;

}
module.exports = FirebaseChat;