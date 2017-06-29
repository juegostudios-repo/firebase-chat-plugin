## Node package for firebase chat application.

## This package is Under Development. Not Ready for use.  

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

### Updating user profile picture
```
app.updateProfilePic(filePath)
.then(fileKey => {
  console.log(filKey)
})
.catch(err => console.log(err));
```

### Sending message
```
app.sendMessage(otherUserId, message, messageType /* optional */, fileKey /* optional */)
.then(res=>console.log(res))
.catch(err=>console.log(err))
```

### Sending Image
```
app.sendImage(imageUrl, otherUserId, type).then(res=>console.log(res), err => console.log(err));
```

### Get file using fileKey
``sendImage()`` method uploads compressed image, returns fileKey. To get actual image use fileKey with ``getFile()`` method.
```
app.getFile(fileKey).then(res=>{console.log(res)})
```

### Receiving Message

```
app.getMessageList(otherUserId).subscribe(message => console.log(message), err => console.log(err));
```

### Listing Recent Channels 
```
app.getChannelList().then(channelList => console.log(channelList)).catch(err=> console.log(err));
```

### Listening to Updated Channels
```
app.listenToUpdatedChannels().subscribe( updatedChannels => console.log(updatedChannels), err => console.log(err));
```

### Get Online Status
```
app.getOnlineStatus(otherUserId).subscribe(onlineStatus=>console.log(onlineStatus));
```

### Typing Indicator 
To set Typing status of the user parameters required are: Receiver's UserID and ID of the <input> tag.
```
app.setIsTypingStatus(otherUserId, inputTagId)
.then(successMsg => console.log(successMsg))
.catch(err=> console.log(err));
```
To get Typing status the user has to send userId of the Other user 
```
app.getIsTypingStatus(OtherUserId).subscribe(TypingStatus => {console.log(TypingStatus);})
```
