const {getToken, getImages, postImage, getVersions, postVersion, getServices} = require('./client')

const fandogh =  {
  /**
   *
   * @param username
   * @param password
   * @returns {Promise<never>}
   */
  login : async ({username, password}) => {
    try {
      return await getToken({username, password})
    } catch(e) {
      return Promise.reject(e)
    } 
  },
  /**
   *
   * @param token
   * @returns {Promise<never>}
   */
  images : async ({token}) => {
    try {
      return await getImages({token})
    } catch(e) {
      return Promise.reject(e)
    } 
  },
  /**
   *
   * @param name
   * @param token
   * @returns {Promise<never>}
   */
  createImage : async ({name, token}) => {
    try {
      return await postImage({token, name})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  /**
   *
   * @param token
   * @param name
   * @returns {Promise<never>}
   */
  versions : async ({token, name}) => {
    try {
      return await getVersions({token, name})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  /**
   *
   * @param name
   * @param version
   * @param source
   * @param token
   * @returns {Promise<never>}
   */
  createVersion: async ({name, version, source, token}) => {
    try {
      return await postVersion({token,version, source, name})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  /**
   *
   * @param token
   * @returns {Promise<never>}
   */
  services : async ({token}) => {
    try {
      return await getServices({token})
    } catch(e) {
      return Promise.reject(e)
    }
  },
}

module.exports = fandogh
