/**
 * Get system health and ask questions
 */
// const FileReader = require('filereader').FileReader
const IncomingForm = require('formidable').IncomingForm
// TODO get the version number or build number here
const greet = 'Hello from Voluntari.ly V0.0.2'
// const fs = require('fs')
// const FR = new FileReader()
// check a bunch of things here like whether the db is connected and responding.
// any depended upon api services
const postImage = (req, res) => {
  var form = new IncomingForm()
  form.on('file', (field, file) => {

    // let FR = new FileReader()
    // let ImageBin = FR.readAsBinaryString(file)
    // let ImageBuffer = Buffer.from(ImageBin, 'binary')
    // fs.writeFile('upload/image.jpeg', ImageBuffer, (err) => {
    //   if (err) console.log(err)
    //   else {
    //     console.log('success')
    //   }
    // })
    console.log(JSON.stringify(file))
  })
  form.on('end', () => {
    const response = {
      message: greet,
      health: 'OK',
      params: req.params,
      query: req.query
    }

    res.json(response)
  })
  form.parse(req)

  // let ImageBuffer = Buffer.from(ImageBin, 'binary')
  // fs.writeFile('upload/image.jpeg', ImageBuffer, (err) => {
  //   if (err) console.log(err)
  //   else {
  //     console.log('success')
  //   }
  // })

  // return res.status(200).json(result)
}

module.exports = postImage
