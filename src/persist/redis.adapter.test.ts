import crypto from 'crypto'
import { RedisAdapter } from './redis.adapter'
import { getRedisClient } from '../redis'
import { type FeatureConfig } from '../@types/options.type'
import { defaultConfig } from '../parseConfig'

jest.mock('../redis')

const getRedisClientMock = getRedisClient as jest.Mock

const redisClientMock = {
  set: jest.fn(),
  get: jest.fn()
}
describe('RedisAdapter', () => {
  beforeEach(() => {
    getRedisClientMock.mockClear()
  })

  it('should save feature config', async () => {
    const config: FeatureConfig = {
      ...defaultConfig,
      features: {
        feature1: true
      }
    }
    getRedisClientMock.mockResolvedValue(redisClientMock)
    const redisAdapter = new RedisAdapter()
    await redisAdapter.save(config)
    expect(getRedisClientMock).toHaveBeenCalledTimes(1)
    expect(redisClientMock.set).toHaveBeenCalledTimes(1)
    expect(redisClientMock.set).toHaveBeenCalledWith('flipper-js_' + crypto.createHash('md5').update('feature1').digest('hex'), 'true')
  })

  it('should get feature status', async () => {
    getRedisClientMock.mockResolvedValue(redisClientMock)
    const hashKey = 'flipper-js_' + crypto.createHash('md5').update('feature1').digest('hex')
    const redisAdapter = new RedisAdapter()
    await redisAdapter.get('feature1')
    expect(getRedisClientMock).toHaveBeenCalledTimes(1)
    expect(redisClientMock.get).toHaveBeenCalledTimes(1)
    expect(redisClientMock.get).toHaveBeenCalledWith(hashKey)
  })
})
