import fs from 'fs'
import path from 'path'
import { type FeatureConfig, featureConfigSchema, Adapter } from './@types/options.type'

export const getFileConfig = (): FeatureConfig => featureConfigSchema.parse(JSON.parse(fs.readFileSync(path.resolve('features.json'), 'utf-8')))

export const defaultConfig: FeatureConfig = {
  features: {},
  storage: {
    type: Adapter.Local
  }
}
