import addDocument from '../commands/addDocument'
import log from '../logger'

export default async function (req, res) {
  const body = req.body

  if (Object.keys(body).length === 0) {
    log.error(`Document not provided.`)
    res.status(400).end()
    return
  }

  await addDocument(body)
  res.status(200).end()
}
