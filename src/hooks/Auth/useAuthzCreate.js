import _ from 'lodash'
import useProcessAuthData from './useProcessAuthData'

export default function useAuthzCreate() {
  const getFileConfig = () => {
    return {
      rules: `{allow, {username, "dashboard"}, subscribe, ["$SYS/#"]}.
{allow, {ipaddr, "127.0.0.1"}, all, ["$SYS/#", "#"]}.
{deny, all, subscribe, ["$SYS/#", {eq, "#"}]}.`,
    }
  }
  const getDatabaseConfig = () => {
    return {
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
  const factory = (type) => {
    switch (type) {
      case 'file':
        return getFileConfig()
      case 'mysql':
        return getDatabaseConfig()
      case 'postgresql':
        return getDatabaseConfig()
      case 'http':
        return getHttpConfig()
      case 'mongodb':
        return getMongodbConfig()
    }
  }
  const { processHttpConfig } = useProcessAuthData()
  const create = (config, type) => {
    let data = {}
    switch (type) {
      case 'http':
        data = processHttpConfig(config)
        break
      default:
        data = _.cloneDeep(config)
        break
    }
    data.type = type
    return data
  }
  return {
    factory,
    create,
  }
}
