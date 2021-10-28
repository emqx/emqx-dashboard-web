import { Message } from 'element-ui'

export default function useProcessAuthData() {
  const processHttpConfig = (data) => {
    try {
      const tempData = _.cloneDeep(data)
      const { body } = data
      if (body !== '') {
        tempData.body = JSON.parse(body)
      } else {
        tempData.body = undefined
      }
      return tempData
    } catch (error) {
      Message.error(error.toString())
    }
  }
  const processRedisConfig = (data) => {
    const tempData = _.cloneDeep(data)
    const { redis_type, servers } = data
    if (redis_type !== 'single') {
      delete tempData.server
      tempData.servers = servers.split(',')
    } else {
      delete tempData.sentinel
      delete tempData.servers
    }
    return tempData
  }
  const processMongoDBConfig = (data) => {
    try {
      const tempData = _.cloneDeep(data)
      const { mongo_type, servers, selector } = data
      if (mongo_type !== 'single') {
        delete tempData.server
        tempData.servers = servers.split(',')
      } else {
        delete tempData.replica_set_name
        delete tempData.servers
      }
      if (selector !== '') {
        tempData.selector = JSON.parse(selector)
      } else {
        tempData.selector = undefined
      }
      return tempData
    } catch (error) {
      Message.error(error.toString())
    }
  }
  const processJwtConfig = (data) => {
    const {
      use_jwks,
      algorithm,
      secret,
      secret_base64_encoded,
      certificate,
      endpoint,
      refresh_interval,
      verify_claims,
    } = data
    const tempData = {
      use_jwks,
      verify_claims,
    }
    if (use_jwks) {
      tempData.endpoint = endpoint
      tempData.refresh_interval = refresh_interval
    } else {
      tempData.algorithm = algorithm
      if (algorithm === 'hmac-based') {
        tempData.secret = secret
        tempData.secret_base64_encoded = secret_base64_encoded
      } else if (algorithm === 'public-key') {
        tempData.certificate = certificate
      }
    }
    return tempData
  }
  return {
    processHttpConfig,
    processMongoDBConfig,
    processRedisConfig,
    processJwtConfig,
  }
}
