export type BaseResponse = {
  status: 'error' | 'success',
}

export interface ErrorResponse extends BaseResponse {
  status: 'error',
  error: string
}


export interface TokenResponse extends BaseResponse {
  status: 'success',
  token: string
}

export interface FeatureConfig {
  features: Record<string, boolean>
  storage: {
    type: 'local' | 'redis'
  }
}

export interface ListFeaturesResponse extends BaseResponse {
  status: 'success',
  config: FeatureConfig
  features: Record<string, boolean>
}
