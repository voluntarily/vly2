/**
  api/verify -> initiates the verification process
 */
const initVerify = async (req, res) => {
  const me = req.query.meid
  console.log("Im in the controller");

  const f = {
    h: "hallo",
    me: meid
  }

  res.json(f)
}


module.exports = {
  initVerify
}
