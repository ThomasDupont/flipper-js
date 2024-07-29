import crypto from 'crypto'
import { getRedisClient, type RedisClient } from '../redis'
import { type PersistAdapter } from './Adapter.interface'
import { type FeatureConfig } from '../@types/options.type'

const KEY_PREFIX = 'flipper-js_'
export class RedisAdapter implements PersistAdapter {
  private readonly redisClient: RedisClient
  constructor () {
    this.redisClient = getRedisClient()
  }

  async save (config: FeatureConfig): Promise<FeatureConfig> {
    const awaitedRedisClient = await this.redisClient
    await Promise.all(Object.entries(config.features).map(async ([feature, status]) =>
      await awaitedRedisClient.set(this.hashKey(feature), status.toString())
    ))

    return config
  }

  async get (key: string): Promise<boolean> {
    const awaitedRedisClient = await this.redisClient
    const hashKey = this.hashKey(key)
    const status = await awaitedRedisClient.get(hashKey)
    return status?.toString() === 'true'
  }

  initConfig = async (_: string, config: FeatureConfig): Promise<FeatureConfig> => {
    const awaitedRedisClient = await this.redisClient
    const statusInRedis = await Promise.all(Object.entries(config.features).map(async ([feature, status]) => {
      const hashKey = this.hashKey(feature)
      const existingStatus = await awaitedRedisClient.get(hashKey)
      if (existingStatus === null) {
        await awaitedRedisClient.set(hashKey, status.toString())

        return { [feature]: status }
      }

      return { [feature]: existingStatus.toString() === 'true' }
    }))

    return {
      ...config,
      features: Object.assign({}, ...statusInRedis)
    }
  }

  private readonly hashKey = (feature: string): string => `${KEY_PREFIX}${crypto.createHash('md5').update(feature).digest('hex')}`
}
