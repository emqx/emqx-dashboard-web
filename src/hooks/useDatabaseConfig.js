import { watch, reactive, ref, computed } from '@vue/composition-api'

export default function useDatabaseConfig({ database, value, authType }, { emit }) {
  const defaultContent = ref('')
  const databaseConfig = reactive(value)
  watch(databaseConfig, (value) => {
    emit('update', value)
  })
  const id = computed(function () {
    return this.$route.params.id
  })
  const helpContent = ref('')
  const setMySql = () => {
    if (authType === 'authn') {
      defaultContent.value =
        "SELECT password_hash FROM mqtt_user where username = '${username}' LIMIT 1"
      helpContent.value = `
        CREATE TABLE IF NOT EXISTS 'mqtt_user' (
          'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
          'username' varchar(100) DEFAULT NULL,
          'password' varchar(100) DEFAULT NULL,
          'salt' varchar(35) DEFAULT NULL,
          'is_superuser' tinyint(1) DEFAULT 0,
          'created' datetime DEFAULT NULL,
          PRIMARY KEY ('id'),
          UNIQUE KEY 'mqtt_username' ('username')
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
    } else {
      defaultContent.value = `SELECT action, permission, topic FROM mqtt_acl where username = '\${username}'`
      helpContent.value = `
        CREATE TABLE 'mqtt_acl' (
          'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
          'ipaddress' VARCHAR(60) NOT NULL DEFAULT '',
          'username' VARCHAR(255) NOT NULL DEFAULT '',
          'clientid' VARCHAR(255) NOT NULL DEFAULT '',
          'action' ENUM('publish', 'subscribe', 'all') NOT NULL,
          'permission' ENUM('allow', 'deny') NOT NULL,
          'topic' VARCHAR(255) NOT NULL DEFAULT '',
          PRIMARY KEY ('id')
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
    }
    if (id.value) {
      return
    }
    databaseConfig.server = '127.0.0.1:3306'
    databaseConfig.query = defaultContent.value
  }
  const setPgSql = () => {
    if (authType === 'authn') {
      defaultContent.value =
        "SELECT password_hash FROM mqtt_user where username = '${username}' LIMIT 1"
      helpContent.value = `
        CREATE TABLE mqtt_user (
          id SERIAL primary key,
          is_superuser boolean,
          username character varying(100),
          password_hash character varying(100),
          salt character varying(40)
        )
      `
    } else {
      defaultContent.value =
        "SELECT password_hash FROM mqtt_user where username = '${username}' LIMIT 1"
      helpContent.value = `
        CREATE TYPE ACTION AS ENUM('publish','subscribe','all');
        CREATE TYPE PERMISSION AS ENUM('allow','deny');

        CREATE TABLE mqtt_acl (
          id SERIAL PRIMARY KEY,
          ipaddress CHARACTER VARYING(60) NOT NULL DEFAULT '',
          username CHARACTER VARYING(255) NOT NULL DEFAULT '',
          clientid CHARACTER VARYING(255) NOT NULL DEFAULT '',
          action ACTION,
          permission PERMISSION,
          topic CHARACTER VARYING(255) NOT NULL
        );
      `
    }
    if (id.value) {
      return
    }
    databaseConfig.server = '127.0.0.1:5432'
    databaseConfig.query = defaultContent.value
  }
  const setMongoDB = () => {
    databaseConfig.mongo_type = 'single'
    databaseConfig.server = '127.0.0.1:27017'
    databaseConfig.topology.connect_timeout_ms = 20000
    databaseConfig.collection = 'mqtt_user'
    databaseConfig.selector = `{"username":"\${username}"}`
    defaultContent.value = databaseConfig.selector
    helpContent.value = `
      {
        username: "emqx_user",
        password_hash: "******",
        salt: "foo+bar",
        is_superuser: false,
        created: "2021-01-01 12:00:01"
      }

      db.mqtt_user.findOne({"username": "emqx_user"})
    `
  }
  const setRedis = () => {
    defaultContent.value = `HMGET mqtt_user:\${username} password_hash`
    helpContent.value = `
      # sample data
      HMSET mqtt_user:emqx_u password_hash *** salt foo+bar is_superuser 1

      # sample cmd
      # HMGET mqtt_user:\${username}

      ## only password
      HMGET mqtt_user:emqx_u password_hash

      ## password + salt
      HMGET mqtt_user:emqx_u password_hash salt

      ## password + salt, enable superuser
      HMGET mqtt_user:emqx_u password_hash salt is_superuser

      ## only password, enable superuser
      HMGET mqtt_user:emqx_u password_hash is_superuser
    `
    if (id.value) {
      const { redis_type, servers } = databaseConfig
      if (redis_type !== 'single') {
        databaseConfig.servers = servers.join(',')
      }
      return
    }
    databaseConfig.redis_type = 'single'
    databaseConfig.server = '127.0.0.1:6379'
    databaseConfig.sentinel = 'mysentinel'
    databaseConfig.database = 0
    databaseConfig.query = defaultContent.value
  }
  switch (database) {
    case 'mysql':
      setMySql()
      break
    case 'postgresql':
      setPgSql()
      break
    case 'mongodb':
      setMongoDB()
    case 'redis':
      setRedis()
  }
  return {
    defaultContent,
    helpContent,
    databaseConfig,
  }
}
