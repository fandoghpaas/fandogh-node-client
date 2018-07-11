const fs = require('fs');
const archiver = require('archiver')

const Helpers = {
  buildImageZip: (source) => {
    return new Promise((resolve, reject) => {
      fs.readdir(source, (err, files) => {
        if(err) reject(err)

        let dockerfile = files.find(file => {
          return file === 'Dockerfile'
        })

        if(!dockerfile) reject({message: 'Docker file is not available in current directory', code:'dockerfile-404'})

        let filterFiles = files.filter(item => item !== 'node_modules')

        Helpers.compress(filterFiles, source).then(source => {
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

      archive.glob('**/*', {
        cwd: directory,
        ignore:['workspace.zip']
      })

      archive.finalize()

    })
  }
}

module.exports = Helpers

