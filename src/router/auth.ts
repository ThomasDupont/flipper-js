import jwt, { type VerifyErrors, type JwtPayload, JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken'
import { Effect as T, pipe } from 'effect'
import { type Response, type NextFunction, type Request } from 'express'
import { type ZodError } from 'zod'
import { type JwtUser, jwtUserSchema } from '../@types/flipper.type'

const getToken = (auth: string | null): string | Error => {
  if (auth !== null) {
    const parts = auth.split(' ')
    if (parts.length < 2) {
      return new Error('Wrong token provided')
    }
    return parts[1]
  }
  return new Error('No token provided')
}

const getTokenEffect = (auth: string | null): T.Effect<string, Error, never> => pipe(
  getToken(auth),
  result => result instanceof Error ? T.fail(result) : T.succeed(result)
)

const verifyTokenEffect = (secret: string) => (token: string): T.Effect<string | JwtPayload, VerifyErrors | Error, never> =>
  T.try({
    try: () => jwt.verify(token, secret),
    catch: error => {
      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError || error instanceof NotBeforeError) {
        return error
      }
      return new Error(`Unexpected error: ${JSON.stringify(error)}`)
    }
  })

const parseSchemaEffect = (undecoded: unknown): T.Effect<JwtUser, ZodError, never> => pipe(
  jwtUserSchema.safeParse(undecoded),
  parse => parse.success ? T.succeed(parse.data) : T.fail(parse.error)
)

export const auth = (secret: string) => (req: Request, res: Response, next: NextFunction): void => {
  pipe(
    getTokenEffect(req.headers.authorization ?? null),
    T.flatMap(verifyTokenEffect(secret)),
    T.flatMap(parseSchemaEffect),
    T.map(user => {
      req.parsedToken = user
      next()
      return T.void
    }),
    T.catchAll(error => {
      res.status(401).json({ error: error.message })
      return T.void
    }),
    T.runSync
  )
}
