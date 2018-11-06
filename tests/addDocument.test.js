import got from 'got'
import { close, _delete, read } from './mongoWrapper'

const endpoint = 'http://localhost/documents'

afterAll(() => {
  return close()
})

afterEach(() => {
  return _delete()
})

describe('add document endpoint', () => {
  it('should return 200', async () => {
    const milliseconds = (new Date()).getTime()
    const body = {
      someNumber: milliseconds,
      someString: 'someString',
      someBoolean: true,
      someObject: {
        someString: 'someString',
        someBoolean: true
      }
    }

    const response = await got(endpoint, { body, json: true })
    expect(response.statusCode).toEqual(200)

    const { _id, ...document } = await read('someNumber', milliseconds)
    expect(document).toEqual(body)
  })

  it('should return 400', async () => {
    const body = {}

    expect(got(endpoint, { body, json: true })).rejects.toHaveProperty('message', 'Response code 400 (Bad Request)')
  })
})
