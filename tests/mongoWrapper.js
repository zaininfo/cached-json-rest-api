import config from 'config'
import invariant from 'invariant'
import { MongoClient } from 'mongodb'

const url = config.mongo && config.mongo.url
invariant(url, 'Mongo URL is required.')

const dbName = config.mongo && config.mongo.database
invariant(dbName, 'Mongo database name is required.')

const collectionName = config.mongo && config.mongo.collection
invariant(collectionName, 'Mongo collection name is required.')

const client = MongoClient.connect(url)

export async function read (fieldName, fieldValue) {
  return (await client).db(dbName).collection(collectionName).findOne({ [fieldName]: fieldValue })
}

export async function create (body) {
  return (await client).db(dbName).collection(collectionName).insertOne(body)
}

export async function _delete () {
  return (await client).db(dbName).collection(collectionName).deleteMany({})
}

export async function close () {
  return (await client).close()
}
