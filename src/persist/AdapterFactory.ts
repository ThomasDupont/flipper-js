import { type FeatureConfig } from '../@types/options.type'
import { type PersistAdapter } from './Adapter.interface'
import { LocalAdapter } from './local.adapter'
import { RedisAdapter } from './redis.adapter'

export class AdapterFactory implements PersistAdapter {
  private readonly adapter: PersistAdapter
  constructor (storageType: string) {
    switch (storageType) {
      case 'local':
        this.adapter = new LocalAdapter()
        break
      case 'redis':
        this.adapter = new RedisAdapter()
        break
      default:
        throw new Error('Invalid storage type')
    }
  }

  getAdapter = (): PersistAdapter => this.adapter

  save = async (config: FeatureConfig): Promise<FeatureConfig> => await this.adapter.save(config)

  get = async (key: string): Promise<boolean> => await this.adapter.get(key)
}
