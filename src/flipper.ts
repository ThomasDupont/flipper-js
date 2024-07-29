/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type FeatureConfig } from './@types/options.type'
import { defaultConfig, getFileConfig } from './parseConfig'
import { type PersistAdapter } from './persist/Adapter.interface'
import { AdapterFactory } from './persist/AdapterFactory'

export default class Flipper {
  private static config: FeatureConfig = defaultConfig
  private static persistAdapter: PersistAdapter = new AdapterFactory('local')

  static init = async (configPath?: string): Promise<void> => {
    const config = getFileConfig(configPath ?? null)
    this.persistAdapter = new AdapterFactory(config.storage.type)
    Flipper.config = await this.persistAdapter.initConfig(configPath ?? 'features.json', config)
  }

  static getConfig = (): FeatureConfig => Flipper.config

  static setPersistAdapter = (adapter: PersistAdapter): void => {
    Flipper.persistAdapter = adapter
  }

  static list = async (): Promise<Record<string, boolean>> => {
    const featureObject = await Promise.all(Object.keys(Flipper.config.features).map(async (feature) => {
      const enabled = await Flipper.isEnabled(feature)
      return [feature, enabled]
    }))

    return Object.fromEntries(featureObject)
  }

  static isEnabled = async (feature: string): Promise<boolean> => await Flipper.persistAdapter.get(feature)

  static enable = async (feature: string): Promise<void> => {
    Flipper.config = await Flipper.persistAdapter.save({
      ...Flipper.config,
      features: {
        ...Flipper.config.features,
        [feature]: true
      }
    })
  }

  static disable = async (feature: string): Promise<void> => {
    Flipper.config = await Flipper.persistAdapter.save({
      ...Flipper.config,
      features: {
        ...Flipper.config.features,
        [feature]: false
      }
    })
  }
}
