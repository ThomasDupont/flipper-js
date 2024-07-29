import jwt from 'jsonwebtoken'
import { auth } from './auth'
import httpMocks from 'node-mocks-http'

const secret = 'secret'

describe('Test auth middleware', () => {
  it('Should hydrate request with parsed token', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${jwt.sign({ login: 'test' }, secret)}`
      }
    })

    const response = httpMocks.createResponse()
    const next = jest.fn()

    auth(secret)(request, response, next)

    expect(request.parsedToken).toEqual({ login: 'test' })
    expect(next).toHaveBeenCalled()
  })

  it('Should call send response with a JsonWebTokenError (invalid signature)', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${jwt.sign({ login: 'test' }, 'wrong')}`
      }
    })
    const response = httpMocks.createResponse()

    const next = jest.fn()
    auth(secret)(request, response, next)

    expect(response._getJSONData().error).toBe('invalid signature')
  })

  it('Should call send response with an error (Wrong token provided)', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: 'something'
      }
    })
    const response = httpMocks.createResponse()
    const next = jest.fn()
    auth(secret)(request, response, next)

    expect(response._getJSONData().error).toBe('Wrong token provided')
  })

  it('Should call send response with an error (ZodError)', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${jwt.sign({ foo: 'bar' }, secret)}`
      }
    })
    const response = httpMocks.createResponse()

    const next = jest.fn()

    auth(secret)(request, response, next)

    const error = JSON.parse(response._getJSONData().error as string)
    expect(error[0].code).toBe('invalid_type')
  })
})
