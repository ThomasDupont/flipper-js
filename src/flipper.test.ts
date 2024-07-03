import Flipper from './flipper'
import { AdapterFactory } from './persist/AdapterFactory'
import { getFileConfig } from './parseConfig'
import { Adapter } from './@types/options.type'
import { getRedisClient } from './redis'
jest.mock('./persist/AdapterFactory')
jest.mock('./parseConfig')

jest.mock('./redis')

const getRedisClientMock = getRedisClient as jest.Mock
const getFileConfigMock = getFileConfig as jest.Mock

const getMock = jest.fn()
const saveMock = jest.fn()
const LocalAdapter = new AdapterFactory('local')
LocalAdapter.get = getMock
LocalAdapter.save = saveMock
const RedisAdapter = new AdapterFactory('redis')
RedisAdapter.get = getMock
RedisAdapter.save = saveMock

describe('Flipper class tests', () => {
  beforeEach(() => {
    getMock.mockClear()
    saveMock.mockClear()
    getFileConfigMock.mockClear()
    getRedisClientMock.mockClear()
  })

  it('should initialize with local adapter', () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })

    Flipper.init()
    expect(Flipper.getConfig().storage.type).toBe('local')
  })

  it('should initialize with redis adapter', () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })

    Flipper.init()
    expect(Flipper.getConfig().storage.type).toBe('redis')
  })

  it('should list all features and their statuses (storage local)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })
    getMock.mockResolvedValueOnce(false)
    getMock.mockResolvedValueOnce(true)
    Flipper.init()
    Flipper.setPersistAdapter(LocalAdapter)
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: true })
  })

  it('should list all features and their statuses (storage redis)', async () => {
    const baseConfig = { features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } }
    getFileConfigMock.mockReturnValue(baseConfig)
    getMock.mockResolvedValueOnce(false)
    getMock.mockResolvedValueOnce(true)

    Flipper.init()
    Flipper.setPersistAdapter(RedisAdapter)
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: true })
    expect(Flipper.getConfig()).toBe(baseConfig)
  })

  it('should enable a feature (local storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })
    saveMock.mockReturnValue({ features: { feature1: true, feature2: true }, storage: { type: Adapter.Local } })
    getMock.mockResolvedValue(true)

    Flipper.init()
    Flipper.setPersistAdapter(LocalAdapter)
    await Flipper.enable('feature1')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: true, feature2: true })
  })

  it('should disable a feature  (local storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Local } })
    saveMock.mockReturnValue({ features: { feature1: false, feature2: false }, storage: { type: Adapter.Local } })
    getMock.mockResolvedValue(false)

    Flipper.init()
    Flipper.setPersistAdapter(LocalAdapter)
    await Flipper.disable('feature2')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: false })
  })

  it('should enable a feature (redis storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })
    getMock.mockResolvedValue(true)

    Flipper.init()
    Flipper.setPersistAdapter(RedisAdapter)
    await Flipper.enable('feature1')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: true, feature2: true })
  })

  it('should disable a feature  (redis storage)', async () => {
    getFileConfigMock.mockReturnValue({ features: { feature1: false, feature2: true }, storage: { type: Adapter.Redis } })
    getMock.mockResolvedValue(false)

    Flipper.init()
    Flipper.setPersistAdapter(RedisAdapter)
    await Flipper.disable('feature2')
    const list = await Flipper.list()
    expect(list).toEqual({ feature1: false, feature2: false })
  })
})
