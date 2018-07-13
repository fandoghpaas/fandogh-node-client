const Request = require('request')
const querystring = require('querystring')
const fs = require('fs')
const baseUrl = 'http://fandogh.cloud:8080/api/'
const { buildImageZip } = require('../helpers')

const client =  {
  /**
   *
   * @param api
   * @param body
   * @param query
   * @param headers
   * @param method
   * @param formData
   * @returns {Promise<any>}
   */
  request: ({api, body , query, headers, method, formData}) => {
    let options = {
      url : baseUrl+api,
      headers,
      method: method || 'GET',
      qs: query,
      form: body,
      formData
    }
    return new Promise((resolve, reject) => {
      Request(options, (error, response, body) => {
        if(error) return reject(JSON.parse(error))
        if (response.statusCode === 200) {
          return resolve(JSON.parse(body))
        } else {
          return reject(JSON.parse(body))
        }
      })
    })
  },
  /**
   *
   * @param token
   * @returns {{Authorization: string}}
   */
  tokenHeader: token => {
    return {Authorization: 'JWT ' + token}
  },
  /**
   *
   * @param username
   * @param password
   * @returns {Promise<never>}
   */
  getToken: async ({username, password}) => {
    try {
      return await client.request({api:'tokens', method: 'POST', body: {username, password}})
    }  catch(e) {
    return Promise.reject(e)
    }
  },
  /**
   *
   * @param token
   * @returns {Promise<never>}
   */
  getImages: async ({token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:'images', method:'GET', headers})
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
  postImage: async ({name, token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:'images', method:'POST', headers, body: {name}})
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
  getVersions: async ({name, token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:`images/${name}/versions`, method:'GET', headers})
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
  postVersion: async ({name, version, source, token}) => {
    try {
      let headers = client.tokenHeader(token)
      let compressedSource = await buildImageZip(source)
      let formData =  {
        source: fs.createReadStream(compressedSource),
        version
      }
      return await client.request({api: `images/${name}/versions`, method:'POST', headers, formData})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  /**
   *
   * @param name
   * @param token
   * @returns {Promise<*>}
   */
  getServices: async ({name, token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:`services`, method:'GET', headers})
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
  postService: async ({token, params}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:'services', method:'POST', headers, body: params})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  /**
   *
   * @param service_name
   * @param token
   * @returns {Promise<*>}
   */
  getLogs: async ({service_name, token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:`services/${service_name}/logs`, method:'GET', headers})
    } catch(e) {
      return Promise.reject(e)
    }
  }
}

module.exports = client