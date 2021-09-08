import { reactive, ref } from '@vue/composition-api'

export default function useDatabaseConfig(database) {
  const defaultSQL = ref(
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
    query: defaultSQL,
    query_timeout: 5000,
    query_timeout_unit: 'ms',
    password_hash_algorithm: 'sha256',
    salt_position: 'prefix',
  })
  const helpSqlContent = ref('')
  const setMySql = () => {
    databaseConfig.server = 'localhost:3306'
    helpSqlContent.value = `
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
    helpSqlContent.value = `
      CREATE TABLE mqtt_user (
        id SERIAL primary key,
        is_superuser boolean,
        username character varying(100),
        password_hash character varying(100),
        salt character varying(40)
      )
    `
  }
  switch (database) {
    case 'mysql':
      setMySql()
      break
    case 'postgresql':
      setPgSql()
      break
  }
  return {
    defaultSQL,
    helpSqlContent,
    databaseConfig,
  }
}
