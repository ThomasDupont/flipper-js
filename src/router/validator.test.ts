import { validate } from './validator'
import httpMocks from 'node-mocks-http'
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

  it('Should send error response with Parsing error', () => {
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

    const error = JSON.parse(response._getJSONData().error as string)
    expect(error[0].code).toBe('invalid_type')
    expect(error[0].path[0]).toBe('password')
  })
})
