import _ from 'lodash'

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
  const factory = (type) => {
    switch (type) {
      case 'file':
        return getFileConfig()
      case 'mysql':
        return getDatabaseConfig()
      case 'postgresql':
        return getDatabaseConfig()
    }
  }
  const create = (config, type) => {
    let data = {}
    switch (type) {
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
