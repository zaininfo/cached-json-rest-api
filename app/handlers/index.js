import Cache from 'express-redis-cache'
import config from 'config'
import Router from 'express-promise-router'
import invariant from 'invariant'
import addDocument from './addDocument'
import searchDocuments from './searchDocuments'
import { setCacheKey } from '../utils/middleware'

const host = config.cache && config.cache.host
invariant(host, 'Redis host name is required.')

const port = config.cache && config.cache.port
invariant(port, 'Redis port number is required.')

const expiry = config.cache && config.cache.expiryInSec
invariant(expiry, 'Expiry time for cache is required.')

const handlers = Router()
const cache = Cache({ host, port, expire: expiry })

handlers.post('/documents', addDocument)
handlers.get('/documents/search', setCacheKey, cache.route(), searchDocuments)

export default handlers
