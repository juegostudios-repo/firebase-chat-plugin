function getFile(fileKey)
{
  return new Promise((resolve, reject)=>{
    this.db.ref('/file/'+ fileKey)
    .once('value', (res)=>{console.log();resolve(res.val())});
  });  
}

module.exports = getFile;