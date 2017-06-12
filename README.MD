## Node package for firebase chat application.


### Import Statement

```
const FirebaseChat  = require('firebase-chat-plugin').FirebaseChat;
or
import {FirebaseChat}  from 'firebase-chat-plugin';
```


### Initialize your app
```
const config = {
  apiKey: "xxxxxx",
  authDomain: "xxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxx.firebaseio.com",
  projectId: "xxxxxxx",
  storageBucket: "xxxxxxx.appspot.com",
  messagingSenderId: "XXXXXXXXXXX"
};
```

You have to get this config from firebase developer console by creating new project.

```
var app = new FirebaseChat(config);
```

### Initialize chat
```
app.initChat(userID, displayName, displayPic)
.then(res=>{
  console.log(res);// return user object
})
.catch(err=> console.log(err));
```


### Sending message
```
app.sendMessage(otherUserId, message, messageType /* optional */, fileKey /* optional */)
.then(res=>console.log(res))
.catch(err=>console.log(err))
```


### Receiving Message
```
app.receiveMessage(otherUserId).subscribe(message => console.log(message));
```


### Listing Recent Chats 
```
app.getRecentChatList().then(channelList => console.log(channelList)).catch(err=> console.log(err));
```


### Typing Indicator 
To set Typing status the user has to send typing status (true , false) and userId of the Other user 
```
app.setIsTypingStatus(otherUserId, typingStatus)
.then(successMsg => console.log(successMsg))
.catch(err=> console.log(err));
```
To get Typing status the user has to send userId of the Other user 
```
app.getIsTypingStatus(OtherUserId).subscribe(TypingStatus => {console.log(TypingStatus);})
```


### Get Online Status
```
app.getOnlineStatus(otherUserId).subscribe(onlineStatus=>console.log(onlineStatus));
```