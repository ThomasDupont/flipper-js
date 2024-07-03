import * as redis from 'redis'

export const getRedisClient = async (): Promise<ReturnType<typeof redis.createClient>> => {
  const url = process.env.FLIPPER_REDIS_URL
  if (url == null) {
    throw new Error('FLIPPER_REDIS_URL env is not found')
  }
  return await redis.createClient({
    url
  }).on('error', err => {
    if (!(err instanceof redis.SocketClosedUnexpectedlyError)) {
      console.error('Redis Client Error', err)
    }
  }).connect()
}

export type RedisClient = ReturnType<typeof getRedisClient>
