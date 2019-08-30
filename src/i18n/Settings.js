export default {
  basic: {
    zh: '基础设置',
    en: 'Basic',
  },
  cluster: {
    zh: '集群设置',
    en: 'Cluster',
  },
  errorRange: {
    zh: '填写错误：数值范围为 {min} - {max}',
    en: 'Fill in the error: the number range is {min} - {max}',
  },
  errorType: {
    zh: '类型错误：请填写 {type} 类型',
    en: 'Type error: please enter {type}',
  },
  errorUnit: {
    zh: '单位错误：请填写 {unit} 单位',
    en: 'Unit error: please enter {unit}',
  },
  pleaseEnter: {
    zh: '请输入',
    en: 'Please enter',
  },
  cancelConfirm: {
    zh: '是否取消本次修改？',
    en: 'You have unsaved changes, confirm cancel?',
  },
  noSaveConfirm: {
    zh: '当前配置未保存，是否离开并放弃？',
    en: 'You have unsaved changes, give up and proceed?',
  },
  confirm: {
    zh: '确认信息',
    en: 'Confirm',
  },
  no: {
    zh: '不',
    en: 'NO',
  },
  setting: {
    zh: '设置',
    en: 'Setting',
  },
  serverSetting: {
    zh: '服务器设置',
    en: 'Server settings',
  },
  basicSetting: {
    zh: '基础设置',
    en: 'Basic Settings',
  },
  mqtt: {
    zh: 'MQTT 协议{0}',
    en: 'MQTT Protocol {0}',
  },
  functional: {
    zh: '功能',
    en: 'Function',
  },
  enable_acl: {
    zh: '是否启用 ACL 检查',
    en: 'Enable ACL check',
  },
  acl_nomatch: {
    zh: 'ACL 未命中时允许或拒绝通过验证',
    en: 'Allow or deny if no ACL rules matched',
  },
  acl_deny_action: {
    zh: 'ACL 被拒绝时的处理动作',
    en: 'The action when acl check reject current operation',
  },
  enable_ban: {
    zh: '是否启用白名单检查',
    en: 'Enable ban check',
  },
  allow_anonymous: {
    zh: '如果未加载身份验证插件，则默认情况下允许匿名身份验证。建议在生产部署中禁用该选项！',
    en: 'Allow anonymous authentication by default if no auth plugins loaded.Disable the option in production deployment!',
  },
  enable_stats: {
    zh: '启用连接状态统计，会降低部分性能',
    en: 'Enable per connection stats',
  },
  use_username_as_clientid: {
    zh: '是否使用用户名替换客户端 ID',
    en: 'Whether use username replace client id',
  },
  retry_interval: {
    zh: 'QoS 1/2 消息传递的重试间隔',
    en: 'Retry interval for QoS1/2 message delivering',
  },
  keepalive_backoff: {
    zh: 'MQTT keepalive 超时回退， keepalive * backoff * 2 时将断开连接',
    en: 'The backoff for MQTT keepalive timeout. The broker will kick a connection out until Keepalive * backoff * 2 timeout',
  },
  max_subscriptions: {
    zh: '允许的最大订阅数，0 表示无限制',
    en: 'Maximum number of subscriptions allowed, 0 means no limit',
  },
  ignore_loop_deliver: {
    zh: '是否忽略消息循环传递，常用于消息桥接',
    en: 'Whether to ignore loop delivery of messages (for mqtt v3.1.1)',
  },
  idle_timeout: {
    zh: 'MQTT 连接空闲超时',
    en: 'Idle timeout of the MQTT connections',
  },
  mqueue_store_qos0: {
    zh: 'QoS0 是否排队',
    en: 'Whether to enqueue QoS0 messages',
  },
  flapping_banned_expiry_interval: {
    zh: '连接的 flapping 到期时间',
    en: 'Flapping expiry interval for connections',
  },
  flapping_threshold: {
    zh: '每分钟的状态更改次数，指定用于检测连接是否开始 flapping 的阈值',
    en: 'The times of state change per min, specifying the threshold which is used to detect if the connection starts flapping',
  },
  force_gc_policy: {
    zh: 'MQTT 连接/消息大小 GC 阈值',
    en: 'Force MQTT connection/session process GC after this number of messages | bytes passed through',
  },
  max_awaiting_rel: {
    zh: '等待 PUBREL 的 QoS2 消息最大数据包数（client->broker），0 表示没有限制',
    en: 'Maximum QoS2 packets (Client -> Broker) awaiting PUBREL, 0 means no limit',
  },
  max_inflight: {
    zh: '保存的已传递但未确认的 QoS1/2 消息的飞行窗口的最大值',
    en: 'Maximum size of the Inflight Window storing QoS1/2 messages delivered but unacked',
  },
  max_mqueue_len: {
    zh: '排队消息的最大长度，0 表示没有限制',
    en: 'Maximum queue length. Enqueued messages when persistent client disconnected, or inflight window is full. 0 means no limit',
  },
  await_rel_timeout: {
    zh: '如果等待 pubrel 超时时间，超时将删除 QoS2 消息（client 发送到 broker）',
    en: 'The QoS2 messages (Client -> Broker) will be dropped if awaiting PUBREL timeout',
  },
  enable_flapping_detect: {
    zh: '是否开启 flapping detect',
    en: 'Whether to turn on flapping detect',
  },
  mqueue_default_priority: {
    zh: '对于不匹配优先级表的主题，默认为最高优先级',
    en: 'Default to highest priority for topics not matching priority table',
  },
  mqueue_priorities: {
    zh: '主题优先级',
    en: 'Topic priorities',
  },
  session_expiry_interval: {
    zh: '会话到期时长 MQTT V3.1.1',
    en: 'Default session expiry interval for MQTT V3.1.1 connections',
  },
  upgrade_qos: {
    zh: '根据订阅强制升级 QoS',
    en: 'Force to upgrade QoS according to subscription',
  },
  max_packet_size: {
    zh: '最大 MQTT 数据包大小',
    en: 'Maximum MQTT packet size allowed',
  },
  max_clientid_len: {
    zh: 'MQTT clientId 的长度限制',
    en: 'Maximum length of MQTT clientId allowed',
  },
  max_topic_levels: {
    zh: '主题层级限制，0 表示没有限制层级',
    en: 'Maximum topic levels allowed. 0 means no limit',
  },
  max_qos_allowed: {
    zh: '最大 QoS',
    en: 'Maximum QoS allowed',
  },
  max_topic_alias: {
    zh: '最大主题别名数量，0 表示不支持主题别名',
    en: 'Maximum Topic Alias, 0 means no topic alias supported',
  },
  retain_available: {
    zh: '是否启用 Retain 消息',
    en: 'Whether the Server supports MQTT retained messages',
  },
  wildcard_subscription: {
    zh: '是否启用通配符订阅',
    en: 'Whether the Server supports MQTT Wildcard Subscriptions',
  },
  shared_subscription: {
    zh: '是否启用共享订阅',
    en: 'Whether the Server supports MQTT Shared Subscriptions',
  },
}
