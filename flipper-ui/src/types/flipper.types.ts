export interface FeatureConfig {
  features: Record<string, boolean>
  storage: {
    type: 'local' | 'redis'
  }
}

export interface ListFeaturesResponse {
  config: FeatureConfig
  features: Record<string, boolean>
}
