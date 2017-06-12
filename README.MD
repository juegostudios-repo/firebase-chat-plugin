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
var app = new FirebaseChat(config)
```

### Initialize chat
```
app.initChat(userID, displayName, displayPic)
.then(res=>{
  console.log(res);// return user object
})
.catch(err=> console.log(err));
```

### Send message
```
app.sendMessage(otherUserId, message, messageType /* optional */, fileKey /* optional */)
.then(res=>console.log(res))
.catch(err=>console.log(err))
```