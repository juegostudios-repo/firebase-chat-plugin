var Observable =  require('rxjs/Rx').Observable;

function listenToIncomingCall()
{
  var call = this.db.ref('/users/'+ this.user.uid + "/" + this.user.$key + '/' + 'incomingCall/' );
  return new Observable((observer)=>{
    call.on('value', (snapshot)=>{
      var val;
      snapshot.forEach((childSnap)=> {
        val = (childSnap.val());
      });
      if(val){
        call.remove();
        //console.log("Removing incomming calls");
        observer.next(val);
      }
    });
   }
  )
}

module.exports = listenToIncomingCall;