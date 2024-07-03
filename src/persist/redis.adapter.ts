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
    return status === 'true'
  }

  private readonly hashKey = (feature: string): string => `${KEY_PREFIX}${crypto.createHash('md5').update(feature).digest('hex')}`
}
