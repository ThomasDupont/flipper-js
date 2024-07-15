import jwt from 'jsonwebtoken'
import path from 'path'
import { Effect as T, pipe } from 'effect'
import { Router, type Response, type Request, json, static as static_ } from 'express'
import Flipper from '../flipper'
import { User } from '../user'
import { auth } from './auth'
import { validate } from './validator'
import { loginPostArgSchema } from '../@types/flipper.type'

const router = Router()
Flipper.init()

router.use(json())

const FLIPPER_API_KEY = process.env.FLIPPER_API_KEY ?? ''

const checkApiKey = (req: Request, res: Response, next: () => void): void => {
  if (FLIPPER_API_KEY.length === 0) {
    res.status(500).json({
      status: 'error',
      error: 'API key not set'
    })
    return
  }
  next()
}

const login = (req: Request, res: Response): void => {
  const { login, password } = req.parsedBody
  void pipe(
    T.tryPromise(async () => await User.checkPassword(login, password)),
    T.map(ok => {
      if (!ok) {
        res.status(401).json({
          status: 'error',
          error: 'Invalid credentials'
        })
        return T.void
      }
      res.json({
        status: 'success',
        token: jwt.sign({ login }, FLIPPER_API_KEY)
      })
      return T.void
    }),
    T.catchAll((e) => {
      console.error('Error checking password', e)
      res.status(401).json({
        status: 'error',
        error: 'Invalid credentials'
      })
      return T.void
    }),
    T.runPromise
  )
}

const list = (req: Request, res: Response): void => {
  void pipe(
    T.tryPromise(async () => await Flipper.list()),
    T.map(features => res.json({
      status: 'success',
      features,
      config: Flipper.getConfig()
    })),
    T.catchAll((e) => {
      console.error('Error listing features', e)
      res.status(500).json({
        status: 'error',
        error: 'Error listing features'
      })
      return T.void
    }),
    T.runPromise
  )
}

const activate = {
  activate: async (feature: string) => { await Flipper.enable(feature) },
  deactivate: async (feature: string) => { await Flipper.disable(feature) }
}

const activateProgram = (type: 'activate' | 'deactivate') => (req: Request, res: Response) => {
  const { feature } = req.params
  void pipe(
    T.tryPromise(async () => { await activate[type](feature) }),
    T.map(() => res.json({
      status: 'success',
      message: `Feature ${type}d`
    })),
    T.catchAll((e) => {
      console.error(`Error ${type}ing feature`, e)
      res.status(500).json({
        status: 'error',
        error: `Error ${type}ing feature`
      })
      return T.void
    }),
    T.runPromise
  )
}

router.use('/assets', static_(path.join(__dirname, '../../flipper-ui/assets')))

router.get('/flipper-js', (_, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../../flipper-ui') })
})

router.get('/flipper-js/auth/ping', checkApiKey, auth(FLIPPER_API_KEY), (_, res) => {
  res.json({ message: 'pong' })
})

router.post('/flipper-js/login', checkApiKey, validate({ postSchema: loginPostArgSchema }), login)

router.get('/flipper-js/features', checkApiKey, auth(FLIPPER_API_KEY), list)

router.post('/flipper-js/features/:feature/enable', checkApiKey, auth(FLIPPER_API_KEY), activateProgram('activate'))

router.post('/flipper-js/features/:feature/disable', checkApiKey, auth(FLIPPER_API_KEY), activateProgram('deactivate'))

export default router
