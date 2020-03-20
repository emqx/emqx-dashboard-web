/* eslint-disable */

export default {
  basic: {
    zh: '基础设置',
    en: 'Basic',
  },
  cluster: {
    zh: '集群设置',
    en: 'Cluster',
  },
  clusterInfo: {
    zh: '集群信息',
    en: 'Cluster Info',
  },
  zone: {
    zh: 'Zone 列表',
    en: 'Zone',
  },
  // 基础设置字段
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
  pleaseSelect: {
    zh: '请选择',
    en: 'Please select',
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
  remove: {
    zh: '移除',
    en: 'Remove',
  },
  removeConfirm: {
    zh: '是否移除该节点？',
    en: 'This will remove the current node. Continue?',
  },
  removeSuccess: {
    zh: '移除成功',
    en: 'Remove Success',
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
    en: 'Allow anonymous authentication by default if no auth plugins loaded. Disable the option in production deployment',
  },
  enable_stats: {
    zh: '启用连接状态统计，会降低部分性能',
    en: 'Enable per connection stats',
  },
  use_username_as_clientid: {
    zh: '是否使用用户名替换客户端 ID',
    en: 'Whether use username replace clientid',
  },
  retry_interval: {
    zh: 'QoS 1/2 消息传递的重试间隔',
    en: 'Retry interval for QoS1/2 message delivering',
  },
  keepalive_backoff: {
    zh: 'MQTT keepalive 超时回退， keepalive * backoff * 2 时将断开连接',
    en: 'The backoff for MQTT keepalive timeout. The broker will kick a connection out until keepalive * backoff * 2 timeout',
  },
  max_subscriptions: {
    zh: '允许的最大订阅数，0 表示无限制',
    en: 'Maximum number of subscriptions allowed, 0 means no limit',
  },
  ignore_loop_deliver: {
    zh: '是否忽略消息循环传递，常用于消息桥接',
    en: 'Whether to ignore loop delivery of messages (for MQTT v3.1.1)',
  },
  mqtt_ignore_loop_deliver: {
    zh: '是否忽略消息循环传递，常用于消息桥接（对于 MQTT v3.1.1）',
    en: 'Whether to ignore loop delivery of messages (for MQTT v3.1.1)',
  },
  idle_timeout: {
    zh: 'MQTT 连接空闲超时',
    en: 'Idle timeout of the MQTT connections',
  },
  mqueue_store_qos0: {
    zh: '是否将 QoS0 的消息存储在队列中',
    en: 'Whether to enqueue QoS0 messages',
  },
  flapping_banned_expiry_interval: {
    zh: '连接的 flapping 到期时间',
    en: 'Flapping expiry interval for connections',
  },
  flapping_threshold: {
    zh: '每分钟的状态更改次数，指定用于检测连接是否开始 flapping 的阈值',
    en: 'The times of state change per minute, specifying the threshold which is used to detect if the connection starts flapping',
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
  mqtt_max_packet_size: {
    zh: '最大 MQTT 数据包大小',
    en: 'Maximum MQTT packet size allowed',
  },
  max_clientid_len: {
    zh: 'MQTT 客户端 ID 的长度限制',
    en: 'Maximum length of MQTT clientid allowed',
  },
  mqtt_max_clientid_len: {
    zh: 'MQTT 客户端 ID 的长度限制',
    en: 'Maximum length of MQTT clientid allowed',
  },
  max_topic_levels: {
    zh: '主题层级限制，0 表示没有限制层级',
    en: 'Maximum topic levels allowed, 0 means no limit',
  },
  mqtt_max_topic_levels: {
    zh: '主题层级限制，0 表示没有限制层级',
    en: 'Maximum topic levels allowed, 0 means no limit',
  },
  max_qos_allowed: {
    zh: '最大 QoS',
    en: 'Maximum QoS allowed',
  },
  mqtt_max_qos_allowed: {
    zh: '最大 QoS',
    en: 'Maximum QoS allowed',
  },
  max_topic_alias: {
    zh: '最大主题别名数量，0 表示不支持主题别名',
    en: 'Maximum Topic Alias, 0 means no topic alias supported',
  },
  mqtt_max_topic_alias: {
    zh: '最大主题别名数量，0 表示不支持主题别名',
    en: 'Maximum Topic Alias, 0 means no topic alias supported',
  },
  retain_available: {
    zh: '是否启用 Retain 消息',
    en: 'Whether the Server supports MQTT retained messages',
  },
  mqtt_retain_available: {
    zh: '是否启用 Retain 消息',
    en: 'Whether the Server supports MQTT retained messages',
  },
  wildcard_subscription: {
    zh: '是否启用通配符订阅',
    en: 'Whether the Server supports MQTT Wildcard Subscriptions',
  },
  mqtt_wildcard_subscription: {
    zh: '是否启用通配符订阅',
    en: 'Whether the Server supports MQTT Wildcard Subscriptions',
  },
  shared_subscription: {
    zh: '是否启用共享订阅',
    en: 'Whether the Server supports MQTT Shared Subscriptions',
  },
  mqtt_shared_subscription: {
    zh: '是否启用共享订阅',
    en: 'Whether the Server supports MQTT Shared Subscriptions',
  },
  hibernate_after: {
    zh: '闲置后进入休眠状态的时间',
    en: 'Hibernate after a duration of idle state',
  },
  acl_cache_max_size: {
    zh: '可以为客户端缓存最大的 ACL 数量',
    en: 'The maximum count of ACL entries can be cached for a client',
  },
  acl_cache_ttl: {
    zh: 'ACL 缓存后将被删除的时间',
    en: 'The time after which an ACL cache entry will be deleted',
  },
  enable_acl_cache: {
    zh: '是否启用 ACL 缓存',
    en: 'Whether to enable ACL cache',
  },
  flapping_detect_policy: {
    zh: '指定全局的 flapping detect 策略',
    en: 'Specify the global flapping detect policy',
  },
  strict_mode: {
    zh: '是否在严格模式下解析 MQTT 帧',
    en: 'Whether to parse the MQTT frame in strict mode',
  },
  mqtt_strict_mode: {
    zh: '是否在严格模式下解析 MQTT 帧',
    en: 'Whether to parse the MQTT frame in strict mode',
  },
  // 集群设置字段
  invite: {
    zh: '邀请',
    en: 'Invite',
  },
  inviteSuccess: {
    zh: '邀请成功',
    en: 'Invite Success',
  },
  clusterType: {
    zh: '集群方式',
    en: 'Cluster Type',
  },
  currentNode: {
    zh: '当前节点',
    en: 'Current Node',
  },
  nodeRequired: {
    zh: '请输入节点名称',
    en: 'Please enter the node name',
  },
  dnsName: {
    zh: 'DNS 名称',
    en: 'DNS',
  },
  app: {
    zh: '节点前缀',
    en: 'Node Prefix',
  },
  app_desc: {
    zh: '用于自动使用 IP 地址构造节点名称如：${name}@127.0.0.1',
    en: 'Used to automatically construct a node name using an IP address: ${name}@127.0.0.1',
  },
  addr: {
    zh: '组播地址',
    en: 'Multicast Address',
  },
  ports: {
    zh: '端口列表',
    en: 'Ports',
  },
  iface: {
    zh: '多播地址',
    en: 'Iface',
  },
  ttl: {
    zh: '多播 TTL',
    en: 'TTL',
  },
  loop: {
    zh: '循环多播',
    en: 'Loop',
  },
  server: {
    zh: 'Etcd 服务器',
    en: 'Etcd Server',
  },
  prefix: {
    zh: '路径前缀',
    en: 'Path Prefix',
  },
  prefix_desc: {
    zh: '用于构造节点路径，路径为 v2/keys/<prefix>/<cluster.name>/<node.name>',
    en: 'Used to construct a node path with v2/keys/<prefix>/<cluster.name>/<node.name>',
  },
  apiserver: {
    zh: 'k8s 服务器列表',
    en: '',
  },
  service_name: {
    zh: '服务器名称',
    en: 'Service Name',
  },
  address_type: {
    zh: '地址类型',
    en: 'Address Type',
  },
  address_type_desc: {
    zh: '用于从 k8s 服务中提取主机名',
    en: 'Used to get hostname from the k8s service',
  },
  app_name: {
    zh: '节点前缀',
    en: 'App Name',
  },
  app_name_desc: {
    zh: '用于构造节点名称',
    en: 'Used to construct the node name',
  },
  namespace: {
    zh: 'k8s 命名空间',
    en: 'k8s Namespace',
  },
  suffix: {
    zh: '主机后缀',
    en: 'Suffix',
  },
  bypass_auth_plugins: {
    zh: '允许 zone 的客户端绕过身份验证步骤',
    en: `Allow the zone's clients to bypass authentication step`,
  },
  manual: {
    zh: '手动集群',
    en: 'Manual cluster',
  },
  dns: {
    zh: 'DNS A 记录自动集群',
    en: 'DNS A record automatic cluster',
  },
  static: {
    zh: '静态节点列表自动集群',
    en: 'Static node list automatic cluster',
  },
  mcast: {
    zh: 'UDP 组播自动集群',
    en: 'UDP multicast automatic cluster',
  },
  etcd: {
    zh: '通过 etcd 自动集群',
    en: 'By etcd automatic cluster',
  },
  k8s: {
    zh: 'Kubernetes 服务自动集群',
    en: 'Kubernetes service automatic cluster',
  },
  joined: {
    zh: '已加入',
    en: 'Joined',
  },
  notJoined: {
    zh: '待加入',
    en: 'Waiting to join',
  },
}
