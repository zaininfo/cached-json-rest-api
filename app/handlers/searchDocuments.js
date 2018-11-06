import searchDocument from '../queries/searchDocument'
import log from '../logger'

export default async function (req, res) {
  const { pageNo, ...fieldObj } = req.query

  const integerPageNo = Number(pageNo)
  if (!Number.isInteger(integerPageNo) || integerPageNo <= 0) {
    log.error(`Non-positive page number provided.`)
    res.status(400).end()
    return
  }

  const fieldPair = Object.entries(fieldObj)
  if (fieldPair.length !== 1) {
    log.error(`Filter field not provided, or more than one filter fields provided.`)
    res.status(400).end()
    return
  }

  const fieldName = fieldPair[0][0]
  const fieldValue = fieldPair[0][1]

  const documents = await searchDocument(fieldName, fieldValue, integerPageNo)
  res.json(documents).end()
}
