const firebase = require('firebase');
const initChat = require('./chat-init');
const sendMessage = require('./send-message');
const receiveMessage = require('./receive-message');
const setIsTypingStatus = require('./set-typing-status');
const getIsTypingStatus = require('./get-typing-status');
const getRecentChatList = require('./recent-chat-list');
const onlineStatus = require('./online-status').onlineStatus;
const loadPrevMsgs = require('./load-previous-msgs');

function FirebaseChat(config) {
    
    this.app = firebase.initializeApp(config);
    this.db = this.app.database();
    this.initChat = initChat;
    this.sendMessage = sendMessage;
    this.receiveMessage = receiveMessage;
    
    this.setIsTypingStatus = setIsTypingStatus;
    this.getIsTypingStatus = getIsTypingStatus;
    
    this.setOnlineStatus = onlineStatus.setOnlineStatus;
    this.getOnlineStatus = onlineStatus.getOnlineStatus;
    
    this.getRecentChatList = getRecentChatList;

    this.loadPrevMsgs = loadPrevMsgs;

}
module.exports = FirebaseChat;