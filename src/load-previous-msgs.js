
var lastTimeStamp;

function loadPrevMsgs(channelId, msgLimit, fromStart) 
{
  if(!msgLimit) 
  {
    var result = [];
    return new Promise((resolve, reject) => {
      this.db.ref('/channel/' + channelId + '/messages').orderByChild('negativetimestamp')
      .limitToFirst(100)
      .once('value').then(snapshot => {
        snapshot.forEach(childsnapshot => {
          result.push(childsnapshot.val());
        });
        result = result.reverse();
        resolve(result);
      }).catch(err => reject(err));
    });
  }
  else 
  {
    if(fromStart)
    {
      lastTimeStamp = 0;
    }
    return new Promise((resolve, reject) => {
      if(!lastTimeStamp)
      {
        var result = [];
        this.db.ref('/channel/' + channelId + '/messages').orderByChild('negativetimestamp')
        .limitToFirst(msgLimit*1)
        .once('value').then(snapshot => {
          snapshot.forEach(childsnapshot => {
            result.push(childsnapshot.val());
          })
          if(result.length > 0)
          {
            lastTimeStamp = result[result.length-1].negativetimestamp + 1;
          }
          result = result.reverse();
          resolve(result);
        })
        .catch(err => reject(err));
      }
      else 
      {
        var result = [];
        this.db.ref('/channel/' + channelId + '/messages').orderByChild('negativetimestamp')
        .limitToFirst(msgLimit*1)
        .startAt(lastTimeStamp)
        .once('value').then(snapshot => {
          snapshot.forEach(childsnapshot => {
            result.push(childsnapshot.val());
          })
          if(result.length > 0)
          {
            lastTimeStamp = result[result.length-1].negativetimestamp + 1;
          }
          if(result.length === 0)
          {
            lastTimeStamp = 0;
          }
          result = result.reverse();
          resolve(result);
        })
        .catch(err => reject(err));
      }
    });
  }
}

module.exports = loadPrevMsgs;