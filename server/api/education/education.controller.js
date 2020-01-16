
const geteducation = function (req, res) {
  const education = [
    'High school Graduate',
    'Some College',
    'Associate and /Bachelor Degree',
    'Bachelor Degree',
    'Masters Degree',
    'Doctoral or professional degree'
  ]
  res.json(education)
}
module.exports = geteducation
