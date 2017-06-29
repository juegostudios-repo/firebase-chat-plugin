const firebase = require('firebase');
const initChat = require('./chat-init');
const sendMessage = require('./send-message');
const getMessageList = require('./get-message-list');
const getChannelList = require('./get-channel-list');
const onlineStatus = require('./online-status').onlineStatus;
const setIsTypingStatus = require('./set-typing-status');
const getIsTypingStatus = require('./get-typing-status');
const sendImage = require('./send-image');
const getFile = require('./get-file');
const updateProfilePic = require('./update-profpic');
const listenToUpdatedChannels = require('./listen-messages');

function FirebaseChat(config) {
    this.app = firebase.initializeApp(config);
    this.db = this.app.database();
    this.initChat = initChat;
    
    this.sendMessage = sendMessage;

    this.getMessageList = getMessageList;

    this.getChannelList = getChannelList;

    this.setOnlineStatus = onlineStatus.setOnlineStatus;
    this.getOnlineStatus = onlineStatus.getOnlineStatus;

    this.sendImage = sendImage;
    this.getFile = getFile;

    this.setIsTypingStatus = setIsTypingStatus;
    this.getIsTypingStatus = getIsTypingStatus;

    this.listenToUpdatedChannels = listenToUpdatedChannels;

    this.updateProfilePic = updateProfilePic;
}
module.exports = FirebaseChat;