const {getToken, getImages, postImage, getVersions, postVersion, getServices, postService, getServiceLogs, getVersionLogs, postManifest} = require('./client')
const helpers = require('./helpers')
const {readYamlFile, createYamlFile}  = helpers;

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
  createImage : async ({name, source, token}) => {
    try {
      return await postImage({token, name, source})
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
   * @param source
   * @returns {Promise<never>}
   */
  createService: async ({image_name, image_version, service_name, environment_variables, port, service_type, source, token}) => {
    try {
      return  postService({token, params: {image_name, image_version, service_name, environment_variables, port, service_type, source}})
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
  serviceLogs : async ({token, service_name}) => {
    try {
      return await getServiceLogs({token, service_name})
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
 versionLogs : async ({token, image, version}) => {
   try {
     return await getVersionLogs({token, image, version})
   } catch(e) {
     return Promise.reject(e)
   }
 },
  
   /**
   * @param token
   * @param manifest
   * @returns {Promise<never>}
   */
  createServiceManifest : async ({manifest, token}) => {
    try {
      return await postManifest({token, manifest})
    } catch(e) {
      return Promise.reject(e)
    }
  },

  /**
   *
   * @param source
   * @returns {Promise<void>}
   */
  config: async (source) => {
    return await readYamlFile(source)
  },
  createYaml: async ({source, configs}) => {
    return await createYamlFile({source, configs})
  }
}

module.exports = fandogh
