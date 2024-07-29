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

  public getAdapter = (): PersistAdapter => this.adapter

  public save = async (config: FeatureConfig): Promise<FeatureConfig> => await this.adapter.save(config)

  public get = async (key: string): Promise<boolean> => await this.adapter.get(key)

  public initConfig = async (path: string, config: FeatureConfig): Promise<FeatureConfig> => await this.adapter.initConfig(path, config)
}
