import { type FeatureConfig } from '../@types/options.type'

export interface PersistAdapter {
  save: (config: FeatureConfig) => Promise<FeatureConfig>
  get: (key: string) => Promise<boolean>
  initConfig: (path: string, config: FeatureConfig) => Promise<FeatureConfig>
}
