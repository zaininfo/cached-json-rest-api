import config from 'config'
import invariant from 'invariant'
import { Logger, transports } from 'winston'

const level = config.log && config.log.level
invariant(level, 'Log level is required.')

const errorFile = config.log && config.log.errorFile
invariant(errorFile, 'Error log file name is required.')

const otherFile = config.log && config.log.otherFile
invariant(otherFile, 'Other logs file name is required.')

const logSinks = [
  new transports.Console(),
  new transports.File({ name: 'error', filename: errorFile, level: 'error' }),
  new transports.File({ name: 'other', filename: otherFile })
]

export default new Logger({
  level: level,
  transports: [ ...logSinks ]
})
