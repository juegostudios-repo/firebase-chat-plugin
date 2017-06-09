const firebase = require('firebase');
const initChat = require('./chat-init')

function FirebaseChat(config) {
    
    this.app = firebase.initializeApp(config, 'Ionic Chat App');
    this.db = this.app.database();
    this.initChat = initChat;    
    
    console.log("init Chat1");
}
module.exports = FirebaseChat;