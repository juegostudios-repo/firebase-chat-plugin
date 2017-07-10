Node package for firebase based chat application
================================================
The purpose of this node package is to quickly implement one to one text & video chat using firebase realtime database as a backend infrastructure. You have to subscribe for your own firebase setup. Currently this package supports one to one chat with text and file messages, also supports user online status, typing status and other important features. 

This package uses [WebRTC](https://webrtc.org/) APIs for video chat. WebRTC uses RTCPeerConnection to communicate streaming data between browsers, but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. In this package we have implemented Signaling methods using Firebase real time database.

### To create firebase setup follow the below steps
1. Goto https://console.firebase.google.com
2. Select "Add Project" and provide a name to your project
3. Click on "Add Firebase to your web app" Option. This will show the firebase connection details.
4. Copy the required credentials to add in your npm package.

### This is the first beta release, please use with caution.

### Installation with ionic framework 3 (currently supported)
```
npm i --save juegostudio-firebase-chat-plugin
```  
Check sample code [here](https://github.com/juegostudio-repo/firebase-chat-plugin/tree/master/example).
In ionic example, video chat requires following permissions in AndroidManifest file. 
``` 
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```
### Import Statement

```
import * as FirebaseChat  from 'juegostudio-firebase-chat-plugin';
```


### Initialize your app
```
const firebaseConfig = {
  apiKey: "xxxxxx",
  authDomain: "xxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxx.firebaseio.com",
  projectId: "xxxxxxx",
  storageBucket: "xxxxxxx.appspot.com",
  messagingSenderId: "XXXXXXXXXXX"
};
```
You have to get  firebaseConfig from firebase developer console by creating new project.
```
// videoChatServerConfig is optional.
const videoChatServerConfig = {
    'iceServers': [
      {
        'urls': 'stun:stun.l.google.com:19302'
      },
      {
        'urls': 'yourturn server',
        'username': 'userName',
        'credential': 'credentials'
      },
      {
        'urls': 'turn server',
        'username': 'username',
        'credential' : 'credentials'
      }
    ]
  }
```
videoChatServerConfig is an optional parameter. URLs for STUN and TURN server can be set using this argument.
For more information about STUN and TURN servers you can refer this [link](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/).

```
var app = new FirebaseChat(firebaseConfig, videoChatServerConfig); /* video chat server config is optional parameter*/
```

### Initialize chat
```
app.initChat(userID, displayName, displayPic)
.then(user=>{
  console.log(user);// return user object
})
.catch(err=> console.log(err));
```
This method will create new user if user doesn't exist, else it will return existing user details. After initialization you'll be able use chat methods mentioned below.

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
.then(res => {
  console.log(res);
})
.catch(err => console.log(err));
```

### Sending Image
```
app.sendImage(imageUrl, otherUserId, type)
.then(res => 
    console.log(res),
  err => console.log(err));
```

### Get file using fileKey
``sendImage()`` method uploads compressed image, returns fileKey. To get actual image use fileKey with ``getFile()`` method.
```
app.getFile(fileKey)
.then(res=> {
  console.log(res);
})
```

### Receiving Message

```
app.getMessageList(otherUserId)
.subscribe(message => {
    console.log(message);
  }, 
  err => console.log(err));
```

### Listing Recent Channels 
```
app.getChannelList()
.then(channelList => {
  console.log(channelList);
})
.catch(err=> console.log(err));
```

### Listening to Updated Channels
```
app.listenToUpdatedChannels()
.subscribe( updatedChannels => {
    console.log(updatedChannels);
  },
  err => console.log(err));
```

### Get Online Status
```
app.getOnlineStatus(otherUserId)
.subscribe(onlineStatus=> {
  console.log(onlineStatus);
});
```

### Typing Indicator 
To set Typing status of the user parameters required are: Receiver's UserID and ID of the input tag.
```
app.setIsTypingStatus(otherUserId, inputTagId)
.then(successMsg => {
  console.log(successMsg);
})
.catch(err=> console.log(err));
```
To get Typing status the user has to send userId of the Other user 
```
app.getIsTypingStatus(OtherUserId)
.subscribe(TypingStatus => {
  console.log(TypingStatus);
});
```

### Start Video Chat

```
  app.initiateCall(otherUid)
    .then(response=>{
      console.log(response);
    })
    .catch(err=>{ console.log(err) });
```
This method will return Promise, if it is successful it will return channelId and localVideoSrc as response object properties. response.localVideoSrc can be used as src for html video tag.

### Listening to incoming Video call

```
  app.listenToIncomingCall()
    .subscribe(res=>{console.log(res)})
``` 
This method will be listening to incoming video calls. If there is a incoming call, you'll get videocall channel ID and initiatedBy(userId of person who has initiated the call) as response object properties. This response properties are required while accept this call.  

### Accepting Video call

```
  app.acceptCall(channelId, initiatedBy)
    .then(response=>console.log(res))
```
This method will accept incoming call. As a response you'll get localVideoSrc as response object prop.

### Displaying remote video streams
After completing signaling you can add ``app.remoteStreamSrc`` as src for remote ``video`` html tag.

### Disconnecting video call
```
  app.disconnectCall(channelId)  
```
This method will stop both remote & local streams. Channel which was used for signaling will be deleted.