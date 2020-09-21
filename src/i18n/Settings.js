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
    zh: '填写错误：数值范围为 ',
    en: 'Fill in the error: the number range is ',
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
    en:
      'Allow anonymous authentication by default if no auth plugins loaded. Disable the option in production deployment',
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
    en:
      'The backoff for MQTT keepalive timeout. The broker will kick a connection out until keepalive * backoff * 2 timeout',
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
    en:
      'The times of state change per minute, specifying the threshold which is used to detect if the connection starts flapping',
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
    en:
      'Maximum queue length. Enqueued messages when persistent client disconnected, or inflight window is full. 0 means no limit',
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
  force_shutdown_policy: {
    zh: '进程消息队列长度 ｜ 内存字节',
    en: 'Process message queue length | Memory byte',
  },
  mountpoint: {
    zh: '主题挂载点',
    en: 'Topic mount point',
  },
  publish_limit: {
    zh: '发布限制',
    en: 'Publish limit',
  },
  server_keepalive: {
    zh: '服务端指定的 Keepalive 时间',
    en: 'The Keepalive time specified by the server',
  },
  response_information: {
    zh: '响应信息',
    en: 'Response information',
  },
  quotaconn_messages_routing: {
    zh: '单个客户端消息转发次数的配额',
    en: 'Quota for the number of times a single client message is forwarded',
  },
  quotaoverall_messages_routing: {
    zh: 'Zone 下面所有客户端消息转发次数的配额',
    en: 'Quota for the number of times all client messages are forwarded under Zone',
  },
  rate_limitconn_bytes_in: {
    zh: '客户端字节流入速率限制',
    en: 'Client byte inflow rate limit',
  },
  rate_limitconn_messages_in: {
    zh: '客户端 Publish 消息流入速率限制',
    en: 'Client Publish message inflow rate limit',
  },
  listener: {
    zh: '监听器',
    en: 'Listener',
  },
  listenerTitle: {
    zh: '当前监听端口列表',
    en: 'Listening Ports',
  },
  listenerProtocol: {
    zh: '监听协议',
    en: 'Protocol',
  },
  listenerAddr: {
    zh: '监听地址',
    en: 'Lisener Address',
  },
  maxConnection: {
    zh: '连接（当前/最大）',
    en: 'Connection(current/maximum)',
  },
  zone: {
    zh: '区域',
    en: 'Zone',
  },
  acceptors: {
    zh: '接收器',
    en: 'Acceptors',
  },
  // new
  busy_dist_port: {
    zh: '是否启用集群 RPC 通道拥塞监控',
    en: 'Whether to enable cluster RPC channel congestion monitoring',
  },
  busy_port: {
    zh: '是否启用进程间消息通道拥塞监控',
    en: 'Whether to enable inter-process message channel congestion monitoring',
  },
  other: {
    zh: '其他',
    en: 'Other',
  },
  alarmMonitor: {
    zh: '告警监控',
    en: 'Alarm Monitor',
  },
  type: {
    zh: '类型',
    en: 'Type',
  },
  max_connections: {
    zh: '最大连接数',
    en: 'Max connections',
  },
  active_n: {
    zh: 'Active',
    en: 'Active',
  },
  max_conn_rate: {
    zh: '每秒最大连接数',
    en: 'Max CPS',
  },
  certfile: {
    zh: '证书文件路径',
    en: 'Cert file path'
  },
  keyfile: {
    zh: '密钥文件路径',
    en: 'Key file path',
  },
  handshake_timeout: {
    zh: '握手超时时间',
    en: 'Handshake timeout',
  },
  ciphers: {
    zh: '密码',
    en: 'Ciphers',
  },
  actions: {
    zh: '动作',
    en: 'Actions',
  },
  size_limit: {
    zh: '大小限制',
    en: 'Size limit',
  },
  validity_period: {
    zh: '有效期',
    en: 'Validity period',
  },
  check_interval: {
    zh: '检查间隔时间',
    en: 'Check interval',
  },
  process_high_watermark: {
    zh: '进程告警上限百分比',
    en: 'Process high watermark'
  },
  process_low_watermark: {
    zh: '进程告警下限百分比',
    en: 'Process low watermark'
  },
  large_heap: {
    zh: '堆栈大小',
    en: 'Large heap',
  },
  long_gc: {
    zh: '垃圾回收时间',
    en: 'Garbage collection time'
  },
  long_schedule: {
    zh: '进程调度时间',
    en: 'Process scheduling time'
  },
  listener_on: {
    zh: '监听口',
    en: 'Listener on',
  },
  cpu_check_interval: {
    zh: 'CPU 占用率检查周期',
    en: 'CPU usage check cycle',
  },
  cpu_high_watermark: {
    zh: 'CPU 告警上限百分比',
    en: 'CPU high watermark',
  },
  cpu_low_watermark: {
    zh: 'CPU 告警下限百分比',
    en: 'CPU low watermark',
  },
  mem_check_interval: {
    zh: '内存占用率检查周期',
    en: 'Memory usage check cycle',
  },
  procmem_high_watermark: {
    zh: '单个进程所占系统内存告警上限百分比',
    en: 'Procmem high watermark',
  },
  sysmem_high_watermark: {
    zh: '所有进程所占系统内存告警上限百分比',
    en: 'Sysmem high watermark',
  },
  reuseaddr: {
    zh: '是否允许允许本地重用端口',
    en: 'Whether to allow local reuse of ports',
  },
  backlog: {
    zh: 'TCP 连接队列的最大长度',
    en: 'Maximum length of TCP connection queue',
  },
  buffer: {
    zh: 'TCP 缓冲区大小 (用户级)',
    en: 'TCP buffer size (user level)',
  },
  cacertfile: {
    zh: 'CA 证书文件路径',
    en: 'CA cert file path',
  },
  dhfile: {
    zh: '若使用 Ephemeral Diffie-Helman 算法，指定算法使用的 key 文件',
    en: 'If using Ephemeral Diffie-Helman algorithm, specify the key file used by the algorithm',
  },
  fail_if_no_peer_cert: {
    zh: '是否让握手失败',
    en: 'Whether to fail the handshake',
  },
  honor_cipher_order: {
    zh: '是否使用服务端的偏好设置选择 Ciphers',
    en: 'Whether to use the server preferences to select Ciphers',
  },
  nodelay: {
    zh: '是否禁用 Nagle 算法，小包将被立即发送',
    en: 'Whether to disable the Nagle algorithm, the packet will be sent immediately',
  },
  peer_cert_as_username: {
    zh: '使用客户端证书中的 CN、DN 或者 CRT 字段的值作为 MQTT CONNECT 报文中的 Username 字段的值。',
    en: 'Use the value of the CN, DN or CRT field in the client certificate as the value of the Username field in the MQTT CONNECT message.',
  },
  proxy_protocol: {
    zh: '监听器是否开启 Proxy Protocol 的支持',
    en: 'Whether the listener enables Proxy Protocol support',
  },
  proxy_protocol_timeout: {
    zh: 'Proxy Protocol 解析的超时时间',
    en: 'Proxy Protocol resolution timeout',
  },
  psk_ciphers: {
    zh: '若使用 PSK 算法，指定服务端支持的 PSK Cipher 列表',
    en: 'If using the PSK algorithm, specify the PSK Cipher list supported by the server',
  },
  rate_limit: {
    zh: '监听器的速率限制',
    en: 'Listener rate limit',
  },
  recbuf: {
    zh: 'TCP 接收缓存区大小（操作系统内核级参数）',
    en: 'TCP receive buffer size (operating system kernel level parameter)',
  },
  reuse_sessions: {
    zh: '是否支持 SSL session 重用',
    en: 'Whether to support SSL session reuse',
  },
  secure_renegotiate: {
    zh: '指定在客户端不遵循 RFC 5746 的情况下，是否拒绝 renegotiation 请求',
    en: 'Specify whether to reject the renegotiation request if the client does not follow RFC 5746',
  },
  send_timeout: {
    zh: 'TCP 报文发送超时时间',
    en: 'TCP packet sending timeout time',
  },
  send_timeout_close: {
    zh: 'TCP 报文发送超时后，是否关闭该连接',
    en: 'Whether to close the connection after the TCP packet is sent overtime',
  },
  sndbuf: {
    zh: 'TCP 发送缓存区大小（操作系统内核级参数）',
    en: 'TCP send buffer size (operating system kernel-level parameter)',
  },
  tls_versions: {
    zh: '指定服务端支持的 SSL 的版本列表',
    en: 'Specify the SSL version list supported by the server',
  },
  tune_buffer: {
    zh: '如果打开此配置，请设置该值等于 sndbuff 与 recbuff 的最大值',
    en: 'If you open this configuration, please set the value equal to the maximum of sndbuff and recbuff',
  },
  verify: {
    zh: '指定握手过程中是否校验客户端',
    en: 'Specify whether to verify the client during the handshake',
  },
  verify_protocol_header: {
    zh: '是否验证 WebSocket 携带的 HTTP 头部是否正确。微信小程序需关闭该验证',
    en: 'Whether to verify whether the HTTP header carried by WebSocket is correct. The WeChat applet needs to close the verification.',
  },
  mqtt_path: {
    zh: 'WebSocket 的 URL Path',
    en: 'URL Path of WebSocket',
  },
  verify_protocol_header: {
    zh: '是否验证 WebSocket 携带的 HTTP 头部是否正确。微信小程序需关闭该验证',
    en: 'Whether to verify whether the HTTP header carried by WebSocket is correct. WeChat Mini Program needs to close the verification',
  },
  compress: {
    zh: '是否压缩 WebSocket 消息',
    en: 'Whether to compress WebSocket messages',
  },
  max_frame_size: {
    zh: '允许的单个 MQTT 报文长度的最大值',
    en: 'The maximum length of a single MQTT packet allowed',
  },
  autoclean: {
    zh: '指定多久之后从集群中删除短线节点',
    en: 'Specify how long to remove short-term nodes from the cluster',
  },
  autoheal: {
    zh: '启用或关闭集群脑裂自动恢复机制',
    en: 'Enable or disable cluster split brain automatic recovery mechanism',
  },
  discovery: {
    zh: '集群节点发现方式，可选值为：manual, static, mcast, dns, etcd, k8s',
    en: 'Cluster node discovery method, optional values ​​are: manual, static, mcast, dns, etcd, k8s',
  },
  name: {
    zh: '集群名称',
    en: 'Cluster name',
  },
  proto_dist: {
    zh: '分布式 Erlang 集群协议类型。可选值为：inet_tcp, inet6_tcp, inet_tls',
    en: 'Distributed Erlang cluster protocol type. Optional values: inet_tcp, inet6_tcp, inet_tls',
  },
  async_batch_size: {
    zh: '异步模式下最大的批量发送消息数。注意此配置在同步模式下不起作用',
    en: 'The maximum number of messages sent in batches in asynchronous mode. Note that this configuration does not work in synchronous mode',
  },
  authentication_timeout: {
    zh: 'RPC 认证超时时间',
    en: 'RPC authentication timeout',
  },
  call_receive_timeout: {
    zh: 'RPC 同步模式的超时时间',
    en: 'Timeout period of RPC synchronous mode',
  },
  connect_timeout: {
    zh: '建立 RPC 连接超时时间',
    en: 'Timeout for establishing RPC connection',
  },
  mode: {
    zh: 'RPC 模式。可选同步或异步模式',
    en: 'RPC mode. Optional synchronous or asynchronous mode',
  },
  socket_buffer: {
    zh: 'TCP 调优参数。用户态的 Socket 缓冲区大小',
    en: 'TCP tuning parameters. User mode Socket buffer size',
  },
  socket_keepalive_count: {
    zh: '连续多少次 keepalive 探测报文都收不到回复的情况下，认为 RPC 连接已丢失',
    en: 'When the keepalive probe packet fails to receive a reply for how many times, the RPC connection is considered lost',
  },
  socket_keepalive_idle: {
    zh: '在最近一次数据包发送多久之后，发送 keepalive 探测报文',
    en: 'How long after the last data packet was sent, send keepalive probe packets',
  },
  socket_keepalive_interval: {
    zh: '发送 keepalive 探测报文的间隔',
    en: 'The interval of sending keepalive probe packets',
  },
  socket_recbuf: {
    zh: 'TCP 调优参数。TCP 接收缓冲区大小',
    en: 'TCP tuning parameters. TCP receive buffer size',
  },
  socket_sndbuf: {
    zh: 'TCP 调优参数。TCP 发送缓冲区大小',
    en: 'TCP tuning parameters. TCP send buffer size',
  },
  tcp_client_port: {
    zh: '远程 RPC 服务的端口',
    en: 'Port of remote RPC service',
  },
  tcp_server_port: {
    zh: '设置 RPC 本地服务使用的监听 port',
    en: 'Set the listening port used by the RPC local service',
  },
  tcp_client_num: {
    zh: 'RPC 通信通道数量',
    en: 'Number of RPC communication channels',
  },
  dir: {
    zh: '日志文件目录',
    en: 'Log file directory',
  },
  file: {
    zh: '日志文件前缀',
    en: 'Log file prefix',
  },
  level: {
    zh: '全局的日志级别',
    en: 'Global log level',
  },
  rotationcount: {
    zh: '日志文件总个数',
    en: 'Total number of log files',
  },
  to: {
    zh: '将日志输出到什么地方。可选值为：off, file, console, both',
    en: 'Where to output the log. Optional values: off, file, console, both',
  },
  chars_limit: {
    zh: '单个日志消息的最大长度',
    en: 'Maximum length of a single log message',
  },
  size: {
    zh: '大小',
    en: 'Size',
  }
}
