import { validate } from './validator'
import httpMocks from 'node-mocks-http'
import { ZodError } from 'zod'
import { loginPostArgSchema } from '../@types/flipper.type'

describe('Test validator middleware', () => {
  it('Should call next function and hydrate parsedBody object', () => {
    const request = httpMocks.createRequest({
      body: {
        login: 'test',
        password: 'test'
      }
    })

    const response = httpMocks.createResponse()
    const next = jest.fn()

    validate({
      postSchema: loginPostArgSchema
    })(request, response, next)

    expect(request.parsedBody).toEqual({
      login: 'test',
      password: 'test'
    })
    expect(next).toHaveBeenCalled()
  })

  it('Should call next function with Parsing error', () => {
    const request = httpMocks.createRequest({
      body: {
        login: 'test'
      }
    })

    const response = httpMocks.createResponse()
    const next = jest.fn()

    validate({
      postSchema: loginPostArgSchema
    })(request, response, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(ZodError)
  })
})
