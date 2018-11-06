import got from 'got'
import { close, _delete, create } from './mongoWrapper'

const endpoint = 'http://localhost/documents/search'

afterAll(() => {
  return close()
})

afterEach(() => {
  return _delete()
})

describe('search document endpoint', () => {
  it('should return no document', async () => {
    const milliseconds = (new Date()).getTime()
    const query = {
      pageNo: 1,
      someNumber: milliseconds
    }

    const response = await got(endpoint, { query, json: true })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual([])
  })

  it('should return one document', async () => {
    const milliseconds = (new Date()).getTime()
    const body = {
      someNumber: milliseconds,
      someString: milliseconds.toString(),
      someBoolean: false,
      someObject: {
        someString: milliseconds.toString(),
        someBoolean: true
      }
    }

    await create(body)

    const query = {
      pageNo: 1,
      someNumber: milliseconds
    }

    let response = await got(endpoint, { query, json: true })
    expect(response.statusCode).toEqual(200)

    delete body._id
    expect(response.body).toEqual([ body ])

    delete query.someNumber
    query.someString = milliseconds.toString()
    response = await got(endpoint, { query, json: true })
    expect(response.statusCode).toEqual(200)

    delete body._id
    expect(response.body).toEqual([ body ])

    delete query.someString
    query.someBoolean = false
    response = await got(endpoint, { query, json: true })
    expect(response.statusCode).toEqual(200)

    delete body._id
    expect(response.body).toEqual([ body ])

    delete query.someBoolean
    query['someObject.someString'] = milliseconds.toString()
    response = await got(endpoint, { query, json: true })
    expect(response.statusCode).toEqual(200)

    delete body._id
    expect(response.body).toEqual([ body ])
  })

  it('should return multiple documents (N per page)', async () => {
    const milliseconds = (new Date()).getTime()
    const bodyTemplate = {
      someNumber: milliseconds,
      someString: 'someString',
      someBoolean: true,
      someObject: {
        someString: 'someString',
        someBoolean: true
      }
    }
    const bodies = []

    for (let i = 0; i < 5; i++) {
      bodyTemplate.itemNo = i + 1
      bodies.push(Object.assign({}, bodyTemplate))
      await create(bodyTemplate)
      delete bodyTemplate._id
    }

    const query = {
      pageNo: 1,
      someNumber: milliseconds
    }

    for (let i = 0, j = 0; i < 3; i++, j = j + 2) {
      query.pageNo = i + 1
      const response = await got(endpoint, { query, json: true })
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual(bodies.slice(j, j + 2))
    }
  })

  it('should return 400', async () => {
    const milliseconds = (new Date()).getTime()
    const body = {
      someNumber: milliseconds,
      someString: milliseconds.toString(),
      someBoolean: true,
      someObject: {
        someString: 'someString',
        someBoolean: true
      }
    }

    await create(body)

    const query = {
      pageNo: 0,
      someNumber: milliseconds
    }

    expect(got(endpoint, { query, json: true })).rejects.toHaveProperty('message', 'Response code 400 (Bad Request)')

    delete query.pageNo
    expect(got(endpoint, { query, json: true })).rejects.toHaveProperty('message', 'Response code 400 (Bad Request)')

    query.pageNo = 1
    query.someString = milliseconds.toString()
    expect(got(endpoint, { query, json: true })).rejects.toHaveProperty('message', 'Response code 400 (Bad Request)')

    delete query.someNumber
    delete query.someString
    expect(got(endpoint, { query, json: true })).rejects.toHaveProperty('message', 'Response code 400 (Bad Request)')
  })
})
