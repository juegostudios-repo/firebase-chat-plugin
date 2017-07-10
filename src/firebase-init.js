const firebase = require('firebase');
const adapter = require('./../vendor/adapter');

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

// Video chat
const initiateCall = require('./video-chat/initiate-call');
const listenToIncomingCall = require('./video-chat/listen-incomingcall');
const acceptCall = require('./video-chat/accept-call');
const disconnectCall = require('./video-chat/disconnect-call');

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

    // Video chat
    this.initiateCall = initiateCall;
    this.acceptCall = acceptCall;
    this.listenToIncomingCall = listenToIncomingCall;
    this.disconnectCall = disconnectCall;
}
module.exports = FirebaseChat;