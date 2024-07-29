import Flipper from './flipper'
import { getFileConfig } from './parseConfig'
import { Adapter } from './@types/options.type'
import { getRedisClient } from './redis'
jest.mock('./parseConfig')

jest.mock('./redis')

const getRedisClientMock = getRedisClient as jest.Mock
const getFileConfigMock = getFileConfig as jest.Mock

const getMock = jest.fn()
const saveMock = jest.fn()

describe('Flipper class tests', () => {
  beforeEach(() => {
    getMock.mockRestore()
    saveMock.mockRestore()
    getFileConfigMock.mockClear()
    getRedisClientMock.mockClear()
    getRedisClientMock.mockResolvedValue({ set: saveMock, get: getMock })
  })

  it('should initialize with local adapter', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })

    await Flipper.init()
    expect(Flipper.getConfig().storage.type).toBe('local')
  })

  it('should initialize with redis adapter', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })
    getMock.mockResolvedValueOnce(null)
    getMock.mockResolvedValueOnce(null)
    await Flipper.init()
    expect(Flipper.getConfig().storage.type).toBe('redis')
  })

  it('should list all features and their statuses (storage local)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })

    getMock.mockResolvedValueOnce(false)
    getMock.mockResolvedValueOnce(true)
    await Flipper.init()
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: true })
  })

  it('should list all features and their statuses (storage redis)', async () => {
    const baseConfig = { features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } }

    getFileConfigMock.mockReturnValue(baseConfig)
    getMock.mockResolvedValueOnce(false) // for init
    getMock.mockResolvedValueOnce(true) // for init
    getMock.mockResolvedValueOnce(false)
    getMock.mockResolvedValueOnce(true)

    await Flipper.init()
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: true })
    expect(JSON.stringify(Flipper.getConfig())).toBe(JSON.stringify(baseConfig))
  })

  it('should enable a feature (local storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })
    saveMock.mockReturnValue({ features: { feature1: true, feature2: true }, storage: { type: Adapter.Local } })
    getMock.mockResolvedValue(true)

    await Flipper.init()
    await Flipper.enable('feature1')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: true, feature2: true })
  })

  it('should disable a feature  (local storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })
    saveMock.mockReturnValue({ features: { feature1: false, feature2: false }, storage: { type: Adapter.Local } })
    getMock.mockResolvedValue(false)

    await Flipper.init()
    await Flipper.disable('feature2')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: false })
  })

  it('should enable a feature (redis storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })
    getMock.mockResolvedValueOnce(false) // for init
    getMock.mockResolvedValueOnce(true) // for init
    getMock.mockResolvedValueOnce(true)
    getMock.mockResolvedValueOnce(true)

    await Flipper.init()
    await Flipper.enable('feature1')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: true, feature2: true })
  })

  it('should disable a feature  (redis storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })
    getMock.mockResolvedValueOnce(false) // for init
    getMock.mockResolvedValueOnce(true) // for init
    getMock.mockResolvedValueOnce(false)
    getMock.mockResolvedValueOnce(false)

    await Flipper.init()
    await Flipper.disable('feature2')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: false })
  })
})

describe('Flipper test all process', () => {
  it('Should init', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })
    getMock.mockResolvedValueOnce(false) // for init
    getMock.mockResolvedValueOnce(true) // for init
    await Flipper.init()
  })

  it('Should enable feature 1', async () => {
    getMock.mockResolvedValueOnce(true)
    getMock.mockResolvedValueOnce(true)

    await Flipper.enable('feature1')

    const list = await Flipper.list()
    expect(list).toEqual({ feature1: true, feature2: true })
  })

  it('Should disable feature 1', async () => {
    getMock.mockResolvedValueOnce(false)
    getMock.mockResolvedValueOnce(true)
    await Flipper.disable('feature1')

    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: true })
  })
})
