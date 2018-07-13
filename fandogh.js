const {getToken, getImages, postImage, getVersions, postVersion, getServices, postService, getLogs} = require('./client')

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
  /**
   *
   * @param image_name
   * @param image_version
   * @param service_name
   * @param environment_variables
   * @param port
   * @param service_type
   * @param token
   * @returns {Promise<never>}
   */
  createService: async ({image_name, image_version, service_name, environment_variables, port, service_type, token}) => {
    try {
      return await postService({token, params: {image_name, image_version, service_name, environment_variables, port, service_type}})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  /**
   *
   * @param token
   * @param service_name
   * @returns {Promise<never>}
   */
  logs : async ({token, service_name}) => {
    try {
      return await getLogs({token, service_name})
    } catch(e) {
      return Promise.reject(e)
    }
  },
}

module.exports = fandogh
