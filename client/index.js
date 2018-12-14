const got = require('got')
const fs = require('fs')
const FormData = require('form-data')
const EventEmitter = require('events').EventEmitter
const baseUrl = 'https://api.fandogh.cloud/fa/api/'
const { buildImageZip, getConfigValue } = require('../helpers')


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
   request: async ({api, body , query, headers, method, formData}) => {

    const options = {
      baseUrl,
      headers,
      method: method || 'GET',
      query,
      json: true
    }

    if(body || formData){
      options.body = formData || body;
    }

    try {
      const result = await got(api, options)
      if(result.statusCode !== 200) throw {error: result.body, code: result.statusCode}
      return result.body;
    } catch (error) {
      console.log(error)
      throw {error: error, code: error.statusCode}
    }
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
  postImage: async ({name, token, source}) => {
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
      imageName = name || imageName
      let headers = client.tokenHeader(token)
      return await client.request({api:`images/${imageName}/versions`, method:'GET', headers})
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
  postVersion:  async ({name, version, source, token}) => {

    const emitter = new EventEmitter();

    try {
      let imageName = getConfigValue({source, type:'name'})
      imageName = name || imageName
      let headers = client.tokenHeader(token)
      let compressedSource = await buildImageZip(source)
      const form = new FormData();
      form.append('source', fs.createReadStream(compressedSource));
      form.append('version', version)
      got.post(`images/${imageName}/versions`, {baseUrl, headers, body: form}).on('uploadProgress', progress => {
        emitter.emit('uploadProgress', progress)
        if(progress.percent === 1){
          emitter.emit('finish', progress)
        }
      }).catch(e => {
        emitter.emit('error', e)
        Promise.reject(e)
      })
      return emitter;
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
   * depracated
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
      let imageName = getConfigValue({source: params.source, type:'name'})
      params.image_name = params.image_name || imageName
      let headers = client.tokenHeader(token)
      return await client.request({api:'services', method:'POST', headers, body: params})
    } catch(e) {
      return Promise.reject(e)
    }
  },

  postManifest: async ({token, manifest}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:'services/manifests', method:'POST', headers, body: manifest})
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