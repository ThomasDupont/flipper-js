import { Effect as T, pipe } from 'effect'
import { type Response, type NextFunction, type Request } from 'express'
import { type ZodError, type AnyZodObject } from 'zod'
import { type PostArgs } from '../@types/flipper.type'

const parseArgsEffect = (codec: AnyZodObject) => (undecoded: unknown): T.Effect<PostArgs, ZodError, never> => pipe(
  codec.safeParse(undecoded),
  parse => parse.success ? T.succeed(parse.data as PostArgs) : T.fail(parse.error)
)

export const validate = ({
  getSchema,
  postSchema
}: {
  getSchema?: AnyZodObject
  postSchema?: AnyZodObject
}) => (req: Request, res: Response, next: NextFunction): void => {
  pipe(
    T.all([
      getSchema != null ? parseArgsEffect(getSchema)(req.query) : T.succeed(null),
      postSchema != null ? parseArgsEffect(postSchema)(req.body) : T.succeed(null)
    ]),
    T.map(([getArgs, postArgs]) => {
      if (getArgs !== null) {
        req.parsedQuery = getArgs
      }

      if (postArgs !== null) {
        req.parsedBody = postArgs
      }
      next()
      return T.void
    }),
    T.catchAll(error => {
      res.json({ error: error.message })
      return T.void
    }),
    T.runSync
  )
}
