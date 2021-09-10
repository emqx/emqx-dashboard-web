import { reactive } from '@vue/composition-api'
import _ from 'lodash'

export default function useAuthnCreate(defaultContent) {
  const builtConfig = reactive({
    user_id_type: 'username',
    password_hash_algorithm: {
      name: 'sha256',
      salt_rounds: 100,
    },
  })
  const httpConfig = reactive({
    method: 'post',
    url: 'http://localhost:8080',
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
  })
  const databaseConfig = reactive({
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
    query_timeout: 5000,
    password_hash_algorithm: 'sha256',
    salt_position: 'prefix',
  })
  const processHttpConfig = (basic, data) => {
    const tempData = _.cloneDeep(data)
    const { body } = data
    tempData.body = JSON.parse(body)
    return {
      ...basic,
      ...tempData,
    }
  }
  return {
    builtConfig,
    httpConfig,
    databaseConfig,
    processHttpConfig,
  }
}
