import { reactive, ref } from '@vue/composition-api'

export default function useDatabaseConfig(database) {
  const defaultContent = ref(
    "SELECT password_hash FROM mqtt_user where username = '${username}' LIMIT 1",
  )
  const databaseConfig = reactive({
    server: '',
    username: 'root',
    password: '',
    poolsize: 8,
    auto_reconnect: true,
    ssl: {
      enable: false,
      verify: false,
      certfile: '',
      keyfile: '',
      cacertfile: '',
    },
    query: defaultContent,
    query_timeout: 5000,
    query_timeout_unit: 'ms',
    password_hash_algorithm: 'sha256',
    salt_position: 'prefix',
    // Mongodb
    mongo_type: '',
    replica_set_name: '',
    topology: {
      connect_timeout_ms: 0,
    },
    collection: '',
    selector: `{"username":"\${username}"}`,
    password_hash_field: '',
    salt_field: '',
    is_superuser_field: '',
  })
  const helpContent = ref('')
  const setMySql = () => {
    databaseConfig.server = 'localhost:3306'
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
  }
  const setPgSql = () => {
    databaseConfig.server = 'localhost:5432'
    helpContent.value = `
      CREATE TABLE mqtt_user (
        id SERIAL primary key,
        is_superuser boolean,
        username character varying(100),
        password_hash character varying(100),
        salt character varying(40)
      )
    `
  }
  const setMongoDB = () => {
    databaseConfig.mongo_type = 'single'
    databaseConfig.server = '127.0.0.1:27017'
    databaseConfig.topology.connect_timeout_ms = 20000
    databaseConfig.collection = 'mqtt_user'
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
  switch (database) {
    case 'mysql':
      setMySql()
      break
    case 'postgresql':
      setPgSql()
      break
    case 'mongodb':
      setMongoDB()
  }
  return {
    defaultContent,
    helpContent,
    databaseConfig,
  }
}
