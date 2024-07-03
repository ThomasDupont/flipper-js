import fs from 'fs'
import { type FeatureConfig } from '../@types/options.type'
import { type PersistAdapter } from './Adapter.interface'
import { getFileConfig } from '../parseConfig'

export class LocalAdapter implements PersistAdapter {
  private config = getFileConfig()
  async save (config: FeatureConfig): Promise<FeatureConfig> {
    fs.writeFileSync('features.json', JSON.stringify(config, null, 2))
    this.config = config
    return await Promise.resolve(config)
  }

  async get (key: string): Promise<boolean> {
    const feature = this.config.features[key]
    return await Promise.resolve(feature ?? false)
  }
}
