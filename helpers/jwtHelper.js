const JWT = require("jsonwebtoken");
module.exports = {
  signAccessToken:(userId) => {
    return new Promise((resolve,reject)=>{
    const payload = {
      name :"hello there"
    }
    const secret = (process.env.JWT_SECRET)
    const options = []
    JWT.sign(payload,secret,options, (err,token)=>{
      if(err) reject(err)
      resolve(token)
    })
    })

  }
}
