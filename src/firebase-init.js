const firebase = require('firebase');
const initChat = require('./chat-init');
const sendMessage = require('./send-message');

function FirebaseChat(config) {
    
    this.app = firebase.initializeApp(config);
    this.db = this.app.database();
    this.initChat = initChat;
    this.sendMessage = sendMessage;
}
module.exports = FirebaseChat;