const fs = require('fs');
const archiver = require('archiver')
const Ignore = require('node-dockerignore')
const yaml = require('js-yaml')
const configPath = "/.fandogh/config.yml"
const fandoghConfigs = require('./fandogh.json')

const Helpers = {

  buildImageZip: (source) => {
    return new Promise((resolve, reject) => {
      fs.readdir(source, (err, files) => {
        if(err) return reject(err)

        let dockerfile = files.find(file => {
          return file === 'Dockerfile'
        })

        if(!dockerfile) return reject({error: 'Docker file is not available in current directory', code:'dockerfile-404'})

        Helpers.compress(files, source).then(source => {
          resolve(source)
        })
      })
    })
  },

  compress: (files, directory) => {

    const path = directory+'/workspace.zip'
    const output = fs.createWriteStream(path)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        resolve(path)
      })

      archive.on('error', function(err) {
        return reject(err)
      });

      archive.pipe(output)
      let DockerIgnore = files.find(file => file === '.dockerignore')
      let ignore = Helpers.getIgnore(directory+'/'+DockerIgnore, files)
      archive.glob('**/*', {
        cwd: directory,
        ignore,
        dot:true
      })

      archive.finalize()

    })
  },

  getIgnore: (dockerignore, files) => {
    let ignore = ['workspace.zip']
    if(dockerignore && fs.existsSync(dockerignore)){
      let ignores = fs.readFileSync(dockerignore).toString().trim().replace('\r', '').split("\n")
      let ig = Ignore().add(ignores)
      if(ignores) {
        ig.filter(files)
        files.forEach(path => {
          if(ig.ignores(path+'/') || ig.ignores(path)){
            ignore = ignore.concat([path, path+'/**'])
          }
        })
      }
    }
    return ignore
  },

  readYamlFile: (source) => {
    try {
      if(!fs.existsSync(source+configPath)) return false
      let config = fs.readFileSync(source+configPath)
      config = yaml.load(config)
      return config
    } catch(e){
      console.error(e)
      return false
    }
  },

  createYamlConfig: (configs) => {

   const yamlConfig = {};
   const configKeys = Object.keys(fandoghConfigs);
   let yamlComment = '';

   configKeys.forEach(config => {
     if(configs[config]){
       yamlConfig[config] = configs[config];
     } else {
       yamlComment += fandoghConfigs[config] +'\n';
     }
   })

   let yml = yaml.dump(yamlConfig);
   return yml+yamlComment;

  },
  createYamlFile: ({source, configs}) => {
    try {

      if (!fs.existsSync(source+'/.fandogh')){
        fs.mkdirSync(source+'/.fandogh');
      } 
      let yml = Helpers.createYamlConfig(configs);
      fs.writeFileSync(source+configPath, yml)
      return yml

    } catch(e){
      console.error(e)
      return false
    }
  },
  getConfigValue({source, type}){
    let config = Helpers.readYamlFile(source)
    let configValue
    if(config) configValue = config['app.'+type]
    return configValue
  }

}

module.exports = Helpers

