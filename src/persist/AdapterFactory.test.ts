import { getRedisClient } from '../redis'
import { AdapterFactory } from './AdapterFactory'
import { LocalAdapter } from './local.adapter'
import { RedisAdapter } from './redis.adapter'

jest.mock('../redis')

const getRedisClientMock = getRedisClient as jest.Mock

describe('AdapterFactory', () => {
  beforeEach(() => {
    getRedisClientMock.mockClear()
  })
  it('should create a local adapter', () => {
    const factory = new AdapterFactory('local')
    expect(factory.getAdapter()).toBeInstanceOf(LocalAdapter)
  })

  it('should create a redis adapter', () => {
    const factory = new AdapterFactory('redis')
    expect(factory.getAdapter()).toBeInstanceOf(RedisAdapter)
  })

  it('should throw error for invalid storage type', () => {
    expect(() => new AdapterFactory('invalid')).toThrowError('Invalid storage type')
  })
})
