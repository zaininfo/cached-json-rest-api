import bodyParser from 'body-parser'
import compression from 'compression'
import config from 'config'
import express from 'express'
import { errorLogger } from 'express-winston'
import invariant from 'invariant'
import handlers from './handlers'
import log from './logger'

const appPort = config.app && config.app.port
invariant(appPort, 'App port is required.')

const app = express()
const errorHandler = errorLogger({ winstonInstance: log })

app.use(compression())
app.use(bodyParser.json())
app.use(handlers)
app.use(errorHandler)

app.listen(appPort, () => log.info(`App listening on port ${appPort}.`))
