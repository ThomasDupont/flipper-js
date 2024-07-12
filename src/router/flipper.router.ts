import jwt from 'jsonwebtoken'
import path from 'path'
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
    res.status(500).json({ message: 'API key not set' })
    return
  }
  next()
}

router.use('/assets', static_(path.join(__dirname, '../../flipper-ui/assets')))

router.get('/flipper-js', (_, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../../flipper-ui') })
})

router.post('/flipper-js/login', checkApiKey, validate({ postSchema: loginPostArgSchema }), (req: Request, res: Response) => {
  void (async () => {
    const { login, password } = req.parsedBody
    const ok = await User.checkPassword(login, password)
    if (!ok) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    res.json({ token: jwt.sign({ login }, FLIPPER_API_KEY) })
  })()
})

router.get('/flipper-js/auth/ping', checkApiKey, auth(FLIPPER_API_KEY), (_, res) => {
  res.json({ message: 'pong' })
})

router.get('/flipper-js/features', checkApiKey, auth(FLIPPER_API_KEY), (req: Request, res: Response) => {
  void (async () => {
    res.json({
      config: Flipper.getConfig(),
      features: await Flipper.list()
    })
  })()
})

router.post('/flipper-js/features/:feature/enable', checkApiKey, auth(FLIPPER_API_KEY), (req, res) => {
  void (async () => {
    await Flipper.enable(req.params.feature)
    res.json({ message: 'Feature enabled' })
  })()
})

router.post('/flipper-js/features/:feature/disable', checkApiKey, auth(FLIPPER_API_KEY), (req, res) => {
  void (async () => {
    await Flipper.disable(req.params.feature)
    res.json({ message: 'Feature disabled' })
  })()
})

export default router
