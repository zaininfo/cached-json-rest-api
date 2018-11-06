import config from 'config'
import invariant from 'invariant'
import { MongoClient } from 'mongodb'

const url = config.mongo && config.mongo.url
invariant(url, 'Mongo URL is required.')

const dbName = config.mongo && config.mongo.database
invariant(dbName, 'Mongo database name is required.')

const client = MongoClient.connect(url)

export default async function () {
  return (await client).db(dbName)
}
