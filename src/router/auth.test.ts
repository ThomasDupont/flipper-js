import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { auth } from './auth'
import httpMocks from 'node-mocks-http'
import { ZodError } from 'zod'

const secret = 'secret'

describe('Test auth middleware', () => {
  const response = httpMocks.createResponse()
  it('Should hydrate request with parsed token', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${jwt.sign({ login: 'test' }, secret)}`
      }
    })

    const next = jest.fn()

    auth(secret)(request, response, next)

    expect(request.parsedToken).toEqual({ login: 'test' })
    expect(next).toHaveBeenCalled()
  })

  it('Should call next function with a JsonWebTokenError (invalid signature)', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${jwt.sign({ login: 'test' }, 'wrong')}`
      }
    })

    const next = jest.fn()
    auth(secret)(request, response, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(JsonWebTokenError)
    expect(next.mock.calls[0][0].message).toBe('invalid signature')
  })

  it('Should call next function with an error (Wrong token provided)', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: 'something'
      }
    })
    const next = jest.fn()
    auth(secret)(request, response, next)
    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(next.mock.calls[0][0].message).toBe('Wrong token provided')
  })

  it('Should call next function with an error (ZodError)', () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${jwt.sign({ foo: 'bar' }, secret)}`
      }
    })

    const next = jest.fn()

    auth(secret)(request, response, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(ZodError)
  })
})
