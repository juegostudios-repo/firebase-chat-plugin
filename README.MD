Node package for firebase based chat application
================================================
The purpose of this node package is to quickly implement one to one text & [video](#video-chat) chat, group text chat using firebase realtime database as a backend infrastructure. You have to subscribe for your own firebase setup. Currently this package supports one to one and group chat with text and file messages, also supports user online status, typing status (for one to one chat) and other important features. 

#### This is the first beta release, please use with caution.
#### If you were using 1.0.0 or 1.0.1 version of this package, before updating you need to clear firebase database.

### Prerequisite
1. **Create Ionic project**
    ```
    ionic start myApp blank
    ```
2. **Create Firebase Account**

    To create firebase setup follow the below steps:
    - Go to https://console.firebase.google.com
    - Select "Add Project" and provide a name to your project
    - Click on "Add Firebase to your web app" Option. This will show the firebase connection details.
    - Copy the required credentials. It is required while initializing your app.
    - You can change the security rules of your database. To know more about it, click [here](https://firebase.google.com/docs/database/security/quickstart) 

### Step 1: Install plugin to your Ionic project (currently ionic framework 3 is supported) 
```
npm i --save juegostudio-firebase-chat-plugin
```

### Step 2: Import the Statement in your Ionic project
```
import * as FirebaseChat  from 'juegostudio-firebase-chat-plugin';
```

### Step 3: Initialize your app

  - Use those credentials which you copied while creating the firebase account. 
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
  - Create a instance
      ```
      var app = new FirebaseChat(firebaseConfig, videoChatServerConfig /*optional*/); 
      ```

### Step 4: Initialize chat
This method will create new user if user doesn't exist, else it will return existing user details. After initialization you'll be able use chat methods mentioned below.
```
app.initChat(userID, displayName, displayPic /*optional*/)
.then(user=>{
  console.log(user);// return user object
})
.catch(err=> console.log(err));
```

### Step 5: Sending message
```
app.sendMessage(otherUserId/groupID, message, channelType, messageType /*optional*/, fileKey /*optional*/)
.then(res => {
  console.log(res);
})
.catch(err => console.log(err));
```

### Step 5: Listing Recent Chat List
```
app.getChannelList()
.then(channelList => {
  console.log(channelList);
})
.catch(err=> console.log(err));
```

### Step 6: Listing & Listening to new Messages
```
app.getMessageList(otherUserId/groupID, channelType)
.subscribe(message => {
    console.log(message);
  }, 
  err => console.log(err));
```

### Video Chat
This package uses [WebRTC](https://webrtc.org/) APIs for video chat. Only one to one video chat is supported. WebRTC uses RTCPeerConnection to communicate streaming data between browsers, but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. In this package we have implemented Signaling methods using Firebase real time database.

### Step 1: Specify the Video configuration
videoChatServerConfig is an `optional` parameter while creating the instance of `FirebaseChat`. URLs for STUN and TURN server can be set using this argument.
```
// videoChatServerConfig looks similar to this.
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
#### Note: 
STUN/TURN servers are required to get working video chat. Without specifying `videoChatServerConfig` video chat will work only on devices connected to same LAN. For more information about STUN and TURN servers you can refer this [link](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/). To host TURN Server refer to this [link](http://turnserver.open-sys.org/downloads/v4.5.0.6/turnserver-4.5.0.6-amazon-aws-ec2-x86_64.txt). It will explain how to host TURN server on Amazon AWS.

### Step 2: Start Video Chat
This method will return Promise, if it is successful it will return channelId and localVideoSrc as response object properties. response.localVideoSrc can be used as ``src`` for html ``video`` tag.
```
  app.initiateCall(otherUid)
    .then(response=>{
      console.log(response);
    })
    .catch(err=>{ console.log(err) });
```

### Step 3: Listening to incoming Video call
This method will be listening to incoming video calls. If there is a incoming call, you'll get videocall channel ID and initiatedBy(userId of person who has initiated this call) as response object properties. This response properties are required while accepting this call.  
```
  app.listenToIncomingCall()
    .subscribe(res=>{console.log(res)})
``` 

### Step 4: Accepting Video call
This method will accept incoming call. As a response you'll get localVideoSrc as response object prop.
```
  app.acceptCall(channelId, initiatedBy)
    .then(response=>console.log(res))
```

### Step 5: Displaying remote video streams
After completing signaling you can add ``app.remoteStreamSrc`` as ``src`` for remote ``video`` html tag.

### Step 6: Disconnecting video call
This method will stop both remote & local streams. Channel which was used for signaling will be deleted.
```
  app.disconnectCall(channelId)  
```

#### NOTE:
Video chat requires some permissions for the android build. So if you are making the android build, you need to set following permissions in AndroidManifest file.
``` 
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### Other Methods

- #### Updating profile picture

  This method is used to update both user and group display picture. 

  - To update group display picture pass the groupID and channelType = 'group'. 
  - To update user display picture pass the channelType = 'one2one'.

      ```
      app.updateProfilePic(filePath, channelType, groupID/*optional*/)
      .then(fileKey => {
        console.log(filKey)
      })
      .catch(err => console.log(err));
      ```

- #### Get User Details
  ```
    app.getUserDetails(otherUserId)
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));
  ```

- #### Listening to Updated Channels
  ```
  app.listenToUpdatedChannels()
  .subscribe( updatedChannels => {
      console.log(updatedChannels);
    },
    err => console.log(err));
  ```

- #### Get Online Status
  ```
  app.getOnlineStatus(otherUserId)
  .subscribe(onlineStatus=> {
    console.log(onlineStatus);
  });
  ```

- #### Typing Indicator 

  To set Typing status of the user parameters required are: Receiver's UserID and id of the ```input``` html tag.
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

- #### Sending Image
  ```
  app.sendImage(imageUrl, otherUserId/groupID, channelType , messageType)
  .then(res => 
      console.log(res),
    err => console.log(err));
  ```

- #### Get file using fileKey

  ``sendImage()`` method uploads compressed image, returns fileKey. To get actual image use fileKey with ``getFile()`` method.
  ```
  app.getFile(fileKey)
  .then(res=> {
    console.log(res);
  })
  ```
  
- #### Creating Group

  This method will create the group with the current userID.
  ```
    app.groupCreate(groupId, groupName, grpProfilePicture /*optional*/)
    .then(details => {
      console.log(details);
    })
    .catch(err => console.log(err));
  ```
  
- #### Adding Group Member

  This method will add one member at a time.
  ```
    app.groupAddMember(userId, grpId)
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));
  ```

- #### Exit Group

  This method will delete the group from your channel list.
  ```
    app.groupDelete(grpId)
    then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));
  ```
