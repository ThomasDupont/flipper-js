import { useEffect, useState } from 'react'
import { Effect as T, pipe } from 'effect'
import { pingAuthToken } from '../api/api'

export const useAuthGuard = (): {
  isLoggedIn: boolean
} => {
  const [isLoggedIn, setIsLogged] = useState(false)
  useEffect(() => {
    void pipe(
      T.try(() => localStorage.getItem('token')),
      T.flatMap(token => T.tryPromise(async () => await pingAuthToken(token ?? ''))),
      T.map(isLoggedIn => {
        setIsLogged(isLoggedIn)
        return T.void
      }),
      T.catchAll((e) => {
        console.error(e)
        return T.void
      }),
      T.runPromise
    )
  }, [])

  return { isLoggedIn }
}
