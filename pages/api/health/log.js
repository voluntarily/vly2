/* The /api/health/log endpoint allows you to push a message into the logfile.
*/
export default (req, res) => {
  console.log('Health:', req.query.msg)
  res.status(200).json(req.query.msg)
}
