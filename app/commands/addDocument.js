import config from 'config'
import invariant from 'invariant'
import getDatabase from '../db'
import log from '../logger'

const collectionName = config.mongo && config.mongo.collection
invariant(collectionName, 'Mongo collection name is required.')

export default async function (body) {
  const db = await getDatabase()
  const { insertedCount } = await db.collection(collectionName).insertOne(body)

  if (insertedCount !== 1) {
    log.error(`One document should be added instead of ${insertedCount}.`)
    throw new Error('Document not added.')
  }
  log.info(`One document added.`)
}
