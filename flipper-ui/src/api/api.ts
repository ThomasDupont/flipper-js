import { type ListFeaturesResponse, type BaseResponse, type ErrorResponse, type TokenResponse } from '../types/flipper.types'


const isErrorResponse = (body: BaseResponse): body is ErrorResponse => {
  return body.status === 'error'
}

export const pingAuthToken = async (token: string): Promise<boolean> => {
  const response = await fetch('/flipper-js/auth/ping', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })

  return response.ok
}

export const login = async (login: string, password: string): Promise<string> => {
  const response = await fetch('/flipper-js/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ login, password })
  })

  const body: ErrorResponse | TokenResponse = await response.json()
  if (isErrorResponse(body)) {
    throw new Error(body.error)
  }

  return body.token
}

export const getFeatures = async (token: string): Promise<ListFeaturesResponse> => {
  const response = await fetch('/flipper-js/features', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })

  const body: ErrorResponse | ListFeaturesResponse = await response.json()
  if (isErrorResponse(body)) {
    throw new Error(body.error)
  }

  return body
}

export const changeFeatureState = (token: string) => async (feature: string, state: boolean): Promise<boolean> => {
  const response = await fetch(`/flipper-js/features/${feature}/${state ? 'enable' : 'disable'}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })

  const body = await response.json()

  if (isErrorResponse(body)) {
    throw new Error(body.error)
  }

  return state
}
