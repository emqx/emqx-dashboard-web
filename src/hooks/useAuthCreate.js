import { reactive } from '@vue/composition-api'
import _ from 'lodash'

export default function useAuthCreate() {
  const builtConfig = reactive({
    user_id_type: 'username',
    password_hash_algorithm: {
      name: 'sha256',
    },
  })
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
  const processHttpConfig = (basic, data) => {
    const tempData = _.cloneDeep(data)
    const { body } = data
    tempData.body = JSON.parse(body)
    return {
      ...basic,
      ...tempData,
    }
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
    factory,
  }
}
