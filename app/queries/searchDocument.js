import config from 'config'
import invariant from 'invariant'
import getDatabase from '../db'
import log from '../logger'
import { parseBoolean } from '../utils/converter'

const collectionName = config.mongo && config.mongo.collection
invariant(collectionName, 'Mongo collection name is required.')

const documentsPerPage = config.search && config.search.documentsPerPage
invariant(documentsPerPage, 'Number of documents per page is required.')

export default async function (fieldName, fieldValue, pageNo) {
  const db = await getDatabase()

  const fieldValueTypes = [ fieldValue ]

  const numericFieldValue = Number(fieldValue)
  if (!isNaN(numericFieldValue)) {
    fieldValueTypes.push(numericFieldValue)
  } else {
    log.debug(`Field value not a number.`)
  }

  const booleanFieldValue = parseBoolean(fieldValue)
  if (typeof booleanFieldValue !== 'undefined') {
    fieldValueTypes.push(booleanFieldValue)
  } else {
    log.debug(`Field value not a boolean.`)
  }

  const documents = db.collection(collectionName).find({ [fieldName]: { $in: [ ...fieldValueTypes ] } })
    .project({ _id: 0 })
    .limit(documentsPerPage)
    .skip((pageNo - 1) * documentsPerPage)
    .toArray()

  if (documents.length === 0) {
    log.info(`No document found for field '${fieldName}' with value '${fieldValue}'.`)
  } else {
    log.info(`Document(s) found for field '${fieldName}' with value '${fieldValue}'.`)
    return documents
  }
}
