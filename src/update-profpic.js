function updateProfilePic(imagePath)
{
  var key = this.user.displayPhoto === ' ' ? this.db.ref().push().key : this.user.displayPhoto;
  return new Promise((resolve, reject)=>{
    getBase64Image(imagePath)
    .then((data)=>{
      return this.db.ref('/file/' + key).set(data);
    })
    .then((done)=>{
      return this.db.ref('/users/'+ this.user.uid +'/'+ this.user.$key +'/displayPhoto').set(key);
    })
    .then((response)=>{
      this.user.displayPhoto = key;
      resolve({success: true, fileKey: key});
    })
    .catch(err=>reject(err));
  });
}

function getBase64Image(filePath)
{
  return new Promise((resolve, reject)=>
    Jimp.read(filePath)
      .then((image) => {
        image.getBase64(image.getMIME(), (err, res)=>{ 
          if(err){
            reject(err);
          }
          resolve(res);
        });
      })
      .catch((err) => {
          reject(err)
      })
  );
}

module.exports = updateProfilePic;