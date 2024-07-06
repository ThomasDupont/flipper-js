import { type ListFeaturesResponse } from '../types/flipper.types'

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

  if (!response.ok) {
    throw new Error('Invalid credentials')
  }

  const { token } = await response.json()

  return token
}

export const getFeatures = async (token: string): Promise<ListFeaturesResponse> => {
  const response = await fetch('/flipper-js/features', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Invalid token')
  }

  return await response.json()
}

export const changeFeatureState = (token: string) => async (feature: string, state: boolean): Promise<boolean> => {
  const response = await fetch(`/flipper-js/features/${feature}/${state ? 'enable' : 'disable'}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Invalid token')
  }

  return state
}
