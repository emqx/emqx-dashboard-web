import _ from 'lodash'

export default function useAuthCreate() {
  const getBuiltInConfig = (type) => {
    if (type === 'password-based') {
      return {
        user_id_type: 'username',
        password_hash_algorithm: {
          name: 'sha256',
        },
      }
    } else if (type === 'scram') {
      return {
        algorithm: 'sha256',
      }
    }
  }
  const getHttpConfig = () => {
    return {
      method: 'post',
      url: 'http://127.0.0.1:8080',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(
        {
          username: '${username}',
          password: '${password}',
        },
        '',
        2,
      ),
      pool_size: 8,
      connect_timeout: 5000,
      request_timeout: 5000,
      enable_pipelining: true,
      ssl: {
        enable: false,
      },
    }
  }
  const getDatabaseConfig = (backend) => {
    const data = {
      server: '',
      username: 'root',
      password: '',
      database: '',
      pool_size: 8,
      auto_reconnect: true,
      ssl: {
        enable: false,
      },
      query: '',
      password_hash_algorithm: 'sha256',
      salt_position: 'prefix',
    }
    if (backend === 'mysql') {
      data.query_timeout = 5000
    }
    return data
  }
  const getRedisConfig = () => {
    return {
      server: '127.0.0.1:6379',
      servers: '127.0.0.1:6379,127.0.0.2:6379,127.0.0.3:6379',
      sentinel: 'mysentinel',
      salt_position: 'prefix',
      redis_type: 'single',
      database: 0,
      auto_reconnect: true,
      password: '',
      password_hash_algorithm: 'sha256',
      pool_size: 8,
      query: '',
      ssl: {
        enable: false,
      },
    }
  }
  const getMongodbConfig = () => {
    return {
      mongo_type: 'single',
      server: '127.0.0.1:27017',
      servers: '127.0.0.1:27017,127.0.0.2:27017',
      database: 'mqtt',
      collection: 'users',
      selector: '',
      password_hash_field: 'password_hash',
      salt_field: 'salt',
      password_hash_algorithm: 'sha256',
      salt_position: 'prefix',
      pool_size: 8,
      ssl: {
        enable: false,
      },
      topology: {
        connect_timeout_ms: 20000,
      },
    }
  }
  const processHttpConfig = (data) => {
    const tempData = _.cloneDeep(data)
    const { body } = data
    tempData.body = JSON.parse(body)
    return tempData
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
    const tempData = _.cloneDeep(data)
    const { mongo_type, servers, selector } = data
    if (mongo_type !== 'single') {
      delete tempData.server
      tempData.servers = servers.split(',')
    } else {
      delete tempData.replica_set_name
      delete tempData.servers
    }
    tempData.selector = JSON.parse(selector)
    return tempData
  }
  const factory = (mechanism, backend) => {
    switch (mechanism) {
      case 'password-based':
        if (backend === 'http-server') {
          return getHttpConfig()
        } else if (backend === 'built-in-database') {
          return getBuiltInConfig('password-based')
        } else if (backend === 'mysql' || backend === 'postgresql') {
          return getDatabaseConfig(backend)
        } else if (backend === 'redis') {
          return getRedisConfig()
        } else if (backend === 'mongodb') {
          return getMongodbConfig()
        }
        break
      case 'scram':
        if (backend === 'built-in-database') {
          return getBuiltInConfig('scram')
        }
        break
    }
  }
  return {
    processHttpConfig,
    processRedisConfig,
    processMongoDBConfig,
    factory,
  }
}
