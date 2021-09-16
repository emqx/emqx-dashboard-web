export default {
  mechanism: {
    zh: '认证方式',
    en: 'Mechanism',
  },
  dataSource: {
    zh: '数据源',
    en: 'Backend',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  backAuthnList: {
    zh: '返回认证列表',
    en: 'Back to Authentication List',
  },
  backAuthzList: {
    zh: '返回权限列表',
    en: 'Back to Authorization List',
  },
  createAuth: {
    zh: '创建认证',
    en: 'Create Authentication',
  },
  createAuthz: {
    zh: '创建权限',
    en: 'Create Authorization',
  },
  config: {
    zh: '配置参数',
    en: 'Configuration',
  },
  selectMechanism: {
    zh: '选择认证方式',
    en: 'Select Mechanism',
  },
  scram: {
    zh: '增强认证',
    en: 'Scram',
  },
  passwordBasedDesc: {
    zh: '使用客户端用户名、ClientID 与密码进行认证',
    en: 'Authenticate using client username, client id, and password',
  },
  jwtDesc: {
    zh: '客户端携带 JWT 进行认证',
    en: 'Authentication using client JWT',
  },
  scramDesc: {
    zh: 'MQTT 5.0 增强认证',
    en: 'MQTT 5 Enhanced Authentication',
  },
  selectDataSource: {
    zh: '选择数据源',
    en: 'Select Backend',
  },
  dataSourceDesc: {
    zh: '选择存储 ACL 数据的数据库或提供 ACL 功能的 HTTP 服务器',
    en: 'Select the database where the ACL data is stored or the HTTP server that provides ACL',
  },
  database: {
    zh: '数据库',
    en: 'Database',
  },
  jwtDataSourceDesc: {
    zh: 'JWT 认证无需选择数据源，请继续下一步配置参数',
    en: 'JWT authentication does not need to select a backend, please continue to the next step to configure the parameters',
  },
  connect: {
    zh: '连接',
    en: 'Connect',
  },
  TLSCerts: {
    zh: 'TLS 证书信息',
    en: 'TLS Certification',
  },
  connectConfig: {
    zh: '连接配置',
    en: 'Connection Configuration',
  },
  reconnect: {
    zh: '自动重连',
    en: 'Reconnect',
  },
  authConfig: {
    zh: '认证配置',
    en: 'Authentication configuration',
  },
  dataConfig: {
    zh: '数据管理',
    en: 'Data Management',
  },
  testSuccess: {
    zh: '测试通过，您的配置可以正常使用',
    en: 'Test success, your configuration works fine',
  },
  testFaild: {
    zh: '测试失败',
    en: 'Test failed',
  },
  sqlHelpContent: {
    zh: '使用默认的 ACL SQL 请在数据库中创建如下表结构：',
    en: ' To use the default SQL. Please create this table in the database:',
  },
  setting: {
    zh: '设置',
    en: 'Setting',
  },
  moveUp: {
    zh: '上移',
    en: 'Move up',
  },
  moveDown: {
    zh: '下移',
    en: 'Move down',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
  },
  disable: {
    zh: '停用',
    en: 'Disable',
  },
  authzSetting: {
    zh: '权限设置',
    en: 'Authorization Setting',
  },
  enableCache: {
    zh: '启用缓存',
    en: 'Enable Cache',
  },
  maxSize: {
    zh: '单客户端缓存条数',
    en: 'Max number of cache per client',
  },
  ttl: {
    zh: '缓存 TTL',
    en: 'TTL',
  },
  basicSettings: {
    zh: '基础设置',
    en: 'Basic Settings',
  },
  authzCache: {
    zh: 'Authorization 缓存',
    en: 'Authorization Cache',
  },
  setDefault: {
    zh: '设置默认',
    en: 'Set default',
  },
  passwordHash: {
    zh: '密码加密方式',
    en: 'Password Hash',
  },
  saltPosition: {
    zh: '加盐方式',
    en: 'Salt Position',
  },
  queryTimeout: {
    zh: '查询超时',
    en: 'Query Timeout',
  },
  userIdType: {
    zh: '账号类型',
    en: 'UserID Type',
  },
  database: {
    zh: '数据库',
    en: 'Database',
  },
  server: {
    zh: '服务',
    en: 'Server',
  },
  servers: {
    zh: '服务列表',
    en: 'Servers',
  },
  enableTLS: {
    zh: '启用 TLS',
    en: 'Enable TLS',
  },
  tlsVerify: {
    zh: '验证服务器证书',
    en: 'TLS Verify',
  },
  mongoType: {
    zh: '部署模式',
    en: 'MongoDB Mode',
  },
  redisType: {
    zh: '部署模式',
    en: 'Redis Mode',
  },
  single: {
    zh: '单节点',
    en: 'Single',
  },
  connectTimeout: {
    zh: '连接超时（毫秒）',
    en: 'Connect Timeout (ms)',
  },
  requestTimeout: {
    zh: '请求超时（毫秒）',
    en: 'Request Timeout (ms)',
  },
  selector: {
    zh: '查询 Selector',
    en: 'Selector',
  },
  exampleDataStructures: {
    zh: '示例数据结构和查询',
    en: 'Example data structures and selector',
  },
  exampleDataCmd: {
    zh: '示例数据结构和命令',
    en: 'Example data structures and command',
  },
  passwordHashField: {
    zh: 'password_hash 字段名',
    en: 'Password_hash Field',
  },
  saltField: {
    zh: 'Salt 字段名',
    en: 'Salt Field',
  },
  superuserField: {
    zh: 'is_superuser 字段名',
    en: 'is_superuser Field',
  },
  sentinel: {
    zh: 'Sentinel 名字',
    en: 'Sentinel Name',
  },
  method: {
    zh: '请求方式',
    en: 'Method',
  },
  enablePipelining: {
    zh: '启用 Pipelining',
    en: 'Enable Pipelining',
  },
  isSuperuser: {
    zh: '是否为超级用户',
    en: 'is superuser',
  },
  validMethod: {
    zh: '验证方式',
    en: 'JWT or JWKS',
  },
  algorithm: {
    zh: '加密方式',
    en: 'Algorithm',
  },
  refreshInterval: {
    zh: 'JWKS 刷新间隔（毫秒）',
    en: 'JWKS Refresh Interval (ms)',
  },
}
