
export default async (req, res) => {
  console.log('notify', req.query)
  return res.status(204).end()
}
