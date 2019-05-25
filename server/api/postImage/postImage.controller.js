/**
 * Get system health and ask questions
 */

// TODO get the version number or build number here
const greet = 'Hello from Voluntari.ly V0.0.2'
const fs = require('fs')
// const FR = new FileReader()
// check a bunch of things here like whether the db is connected and responding.
// any depended upon api services
const postImage = (req, res) => {
  const result = {
    message: greet,
    health: 'OK',
    params: req.params,
    query: req.query
  }
  // const ImageBin = req.body

  console.log(JSON.stringify(req.body))
  // let ImageBuffer = Buffer.from(ImageBin, 'binary')
  // fs.writeFile('upload/image.jpeg', ImageBuffer, (err) => {
  //   if (err) console.log(err)
  //   else {
  //     console.log('success')
  //   }
  // })

  return res.status(200).json(result)
}

module.exports = postImage
