const {getToken, getImages, postImage} = require('./client')

const fandogh =  {
  login : async ({username, password}) => {
    try {
      return await getToken({username, password})
    } catch(e) {
      return Promise.reject(e)
    } 
  },
  images : async ({token}) => {
    try {
      return await getImages({token})
    } catch(e) {
      return Promise.reject(e)
    } 
  },
  createImage : async ({name, token}) => {
    try {
      return await postImage({token, name})
    } catch(e) {
      return Promise.reject(e)
    } 
  }

}

module.exports = fandogh
