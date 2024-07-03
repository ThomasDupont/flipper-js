import { useEffect, useState } from "react"
import { Effect as T, pipe } from 'effect'
import { pingAuthToken } from "../api/api"

export const useAuthGuard = () => {
    const [ isLoggedIn , setIsLogged ] = useState(false)
    useEffect(() => {
        pipe(
            T.try(() => localStorage.getItem('token')),
            T.flatMap(token => T.tryPromise(() => pingAuthToken(token ?? ''))),
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
