const Request = require('request')
const baseUrl = 'http://fandogh.cloud:8080/api/'

const client =  {
  request: ({api, body , query, headers, method}) => {

    let options = {
      url : baseUrl+api,
      headers: {
        ...headers
      },
      method: method || 'GET',
      qs: query,
      form: body,
    }

    return new Promise((resolve, reject) => {
      Request(options, (error, response, body) => {
        if(error) return reject(JSON.parse(error))
        if (response.statusCode == 200) {
          return resolve(JSON.parse(body))
        } else {
          return reject(JSON.parse(body))
        }
      })
    })
  },

  tokenHeader: token => {Authorization: 'JWT ' + token},

  getToken: async ({username, password}) => {
    try {
      return await client.request({api:'tokens', method: 'POST', body: {username, password}})
    }  catch(e) {
    return Promise.reject(e)
    }
  },
  getImages: async ({token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:'images', methods:'GET', headers})
    } catch(e) {
      return Promise.reject(e)
    }
  },
  postImage: async ({name, token}) => {
    try {
      let headers = client.tokenHeader(token)
      return await client.request({api:'images', methods:'POST', headers})
    } catch(e) {
      return Promise.reject(e)
    }
  }

}

module.exports = client