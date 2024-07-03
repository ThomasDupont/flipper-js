import { z } from 'zod'

export enum Adapter {
  Local = 'local',
  Redis = 'redis'
}
export const featureConfigSchema = z.object({
  features: z.record(z.boolean()),
  storage: z.object({
    type: z.nativeEnum(Adapter)
  })
})

export type FeatureConfig = z.infer<typeof featureConfigSchema>

export const featureSchema = z.string().min(1, 'Feature name cannot be empty')
