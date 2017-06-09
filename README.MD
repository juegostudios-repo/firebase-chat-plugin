Node package for firebase chat application.

##Import Statement
``js
const FirebaseChat  = require('firebase-chat-plugin').FirebaseChat;
``

##Initialize your app
``js
const config = {
  apiKey: "xxxxxx",
  authDomain: "xxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxx.firebaseio.com",
  projectId: "xxxxxxx",
  storageBucket: "xxxxxxx.appspot.com",
  messagingSenderId: "499915985318"
};
``
You have to get this config from firebase developer console by creating new project.
``js
var app = new FirebaseChat(config)
``
##Initialize chat
``js
app.initChat(userID, displayName, displayPic)
.then(res=>{
  console.log(res);// return user object
})
.catch(err=> console.log(err));
``