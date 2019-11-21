export default async (req, res) => {
  console.log('notifyOrg', req.query)
  return res.status(204).end()
}
