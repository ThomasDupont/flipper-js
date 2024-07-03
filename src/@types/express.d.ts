import { type InnovationLabJwtData } from './innovationLab.type'
import { type PostArgs } from './flipper.type'

declare global {
  module Express {
    interface Request {
      id: string
      parsedToken: InnovationLabJwtData
      parsedBody: PostArgs
      parsedQuery: Record<string, string>
    }
  }
}

export {}
