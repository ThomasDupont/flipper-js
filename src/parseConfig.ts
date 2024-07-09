import fs from 'fs'
import path from 'path'
import { type FeatureConfig, featureConfigSchema, Adapter } from './@types/options.type'

export const defaultConfig: FeatureConfig = {
  features: {},
  storage: {
    type: Adapter.Local
  }
}

let configPath: string = 'features.json'
export const getFileConfig = (pathToConfig: string | null): FeatureConfig => {
  if (pathToConfig != null) {
    configPath = pathToConfig
  }

  return featureConfigSchema.parse(JSON.parse(fs.readFileSync(path.resolve(configPath), 'utf-8')))
}
