export type FeatureConfig = {
    features: Record<string, boolean>
    storage: {
        type: 'local' | 'redis'
    }
}

export type ListFeaturesResponse = {
    config: FeatureConfig
    features: Record<string, boolean>
}
