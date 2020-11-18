/* eslint-disable */

export default {
  basic: {
    zh: '基础设置',
    ja: '基本設定',
    en: 'Basic',
  },
  cluster: {
    zh: '集群设置',
    ja: 'クラスター設定',
    en: 'Cluster',
  },
  clusterInfo: {
    zh: '集群信息',
    ja: 'クラスター情報',
    en: 'Cluster Info',
  },
  zone: {
    zh: 'Zone 列表',
    ja: 'ゾーンリスト',
    en: 'Zone',
  },
  // 基础设置字段
  errorRange: {
    zh: '填写错误：数值范围为 {min} - {max}',
    ja: '入力エラー：有効範囲は {min} - {max}',
    en: 'Fill in the error: the number range is {min} - {max}',
  },
  errorType: {
    zh: '类型错误：请填写 {type} 类型',
    ja: 'タイプエラー： {type} タイプを入力してください',
    en: 'Type error: please enter {type}',
  },
  errorUnit: {
    zh: '单位错误：请填写 {unit} 单位',
    ja: '単位エラー：{unit} 単位を入力してください',
    en: 'Unit error: please enter {unit}',
  },
  pleaseEnter: {
    zh: '请输入',
    ja: '入力してください',
    en: 'Please enter',
  },
  pleaseSelect: {
    zh: '请选择',
    ja: '選択してください',
    en: 'Please select',
  },
  cancelConfirm: {
    zh: '是否取消本次修改？',
    ja: '今回の変更を破棄しますか',
    en: 'You have unsaved changes, confirm cancel?',
  },
  noSaveConfirm: {
    zh: '当前配置未保存，是否离开并放弃？',
    ja: '設定内容はまだ保存しません。このページを離れてもよろしいですか？',
    en: 'You have unsaved changes, give up and proceed?',
  },
  confirm: {
    zh: '确认信息',
    ja: '確認',
    en: 'Confirm',
  },
  remove: {
    zh: '移除',
    ja: '外す',
    en: 'Remove',
  },
  removeConfirm: {
    zh: '是否移除该节点？',
    ja: 'このノードを外しますか',
    en: 'This will remove the current node. Continue?',
  },
  removeSuccess: {
    zh: '移除成功',
    ja: '外すことが成功しました',
    en: 'Remove Success',
  },
  no: {
    zh: '不',
    ja: 'いいえ',
    en: 'NO',
  },
  setting: {
    zh: '设置',
    ja: '設定',
    en: 'Setting',
  },
  serverSetting: {
    zh: '服务器设置',
    ja: 'サーバー設定',
    en: 'Server settings',
  },
  basicSetting: {
    zh: '基础设置',
    ja: '基本設定',
    en: 'Basic Settings',
  },
  mqtt: {
    zh: 'MQTT 协议{0}',
    ja: 'MQTT プロトコル{0}',
    en: 'MQTT Protocol {0}',
  },
  functional: {
    zh: '功能',
    ja: '関数',
    en: 'Function',
  },
  enable_acl: {
    zh: '是否启用 ACL 检查',
    ja: 'ACL検査を有効にしますか',
    en: 'Enable ACL check',
  },
  acl_nomatch: {
    zh: 'ACL 未命中时允许或拒绝通过验证',
    ja: '一致するACLルールがない場合に許可、または、拒否されますか',
    en: 'Allow or deny if no ACL rules matched',
  },
  acl_deny_action: {
    zh: 'ACL 被拒绝时的处理动作',
    ja: 'ACLが拒否されたときの動作',
    en: 'The action when acl check reject current operation',
  },
  allow_anonymous: {
    zh: '如果未加载身份验证插件，则默认情况下允许匿名身份验证。建议在生产部署中禁用该选项！',
    ja: 'Authプラグインがアンロードの場合、匿名認証が有効になります。実稼動環境でこのオプションを無効化してください',
    en:
      'Allow anonymous authentication by default if no auth plugins loaded. Disable the option in production deployment',
  },
  retry_interval: {
    zh: 'QoS 1/2 消息传递的重试间隔',
    ja: 'QoS 1/2 メッセージ転送のリトライ間隔',
    en: 'Retry interval for QoS1/2 message delivering',
  },
  mqtt_ignore_loop_deliver: {
    zh: '是否忽略消息循环传递，常用于消息桥接（对于 MQTT v3.1.1）',
    ja: 'メッセージがループで転送することを無視しますか（MQTT v3.1.1のみ）',
    en: 'Whether to ignore loop delivery of messages (for MQTT v3.1.1)',
  },
  mqueue_store_qos0: {
    zh: '是否将 QoS0 的消息存储在队列中',
    ja: 'QoS0メッセージをキューに入れますか',
    en: 'Whether to enqueue QoS0 messages',
  },
  flapping_banned_expiry_interval: {
    zh: '连接的 flapping 到期时间',
    ja: 'flapping接続の有効期限',
    en: 'Flapping expiry interval for connections',
  },
  flapping_threshold: {
    zh: '每分钟的状态更改次数，指定用于检测连接是否开始 flapping 的阈值',
    ja: '接続済になるかを検出するために、flappingの閾値を指定して、1分あたりのステータス変更回数',
    en:
      'The times of state change per minute, specifying the threshold which is used to detect if the connection starts flapping',
  },
  mqtt_max_packet_size: {
    zh: '最大 MQTT 数据包大小',
    ja: '許可される最大MQTTパケットサイズ',
    en: 'Maximum MQTT packet size allowed',
  },
  mqtt_max_clientid_len: {
    zh: 'MQTT 客户端 ID 的长度限制',
    ja: '許可されるMQTTクライアントIDの最大長さ',
    en: 'Maximum length of MQTT clientid allowed',
  },
  mqtt_max_topic_levels: {
    zh: '主题层级限制，0 表示没有限制层级',
    ja: '許可される最大トピックレベル（0の場合無制限です）',
    en: 'Maximum topic levels allowed, 0 means no limit',
  },
  mqtt_max_qos_allowed: {
    zh: '最大 QoS',
    ja: '最大 QoS',
    en: 'Maximum QoS allowed',
  },
  mqtt_max_topic_alias: {
    zh: '最大主题别名数量，0 表示不支持主题别名',
    ja: '最大トピックエイリアス（0の場合トピックエイリアスをサポートしない）',
    en: 'Maximum Topic Alias, 0 means no topic alias supported',
  },
  mqtt_retain_available: {
    zh: '是否启用 Retain 消息',
    ja: 'MQTT Retainメッセージを有効にしますか',
    en: 'Whether the Server supports MQTT retained messages',
  },
  mqtt_wildcard_subscription: {
    zh: '是否启用通配符订阅',
    ja: 'MQTTワイルドカード・サブスクリプションを有効にしますか',
    en: 'Whether the Server supports MQTT Wildcard Subscriptions',
  },
  mqtt_shared_subscription: {
    zh: '是否启用共享订阅',
    ja: 'MQTTサブスクリプション共有を有効にしますか',
    en: 'Whether the Server supports MQTT Shared Subscriptions',
  },
  hibernate_after: {
    zh: '闲置后进入休眠状态的时间',
    ja: 'アイドル状態になってからスリープまでの時間',
    en: 'Hibernate after a duration of idle state',
  },
  acl_cache_max_size: {
    zh: '可以为客户端缓存最大的 ACL 数量',
    ja: 'クライアントのACLキャッシュエントリの最大数',
    en: 'The maximum count of ACL entries can be cached for a client',
  },
  acl_cache_ttl: {
    zh: 'ACL 缓存后将被删除的时间',
    ja: 'ACL キャッシュエントリが削除されるまでの時間',
    en: 'The time after which an ACL cache entry will be deleted',
  },
  enable_acl_cache: {
    zh: '是否启用 ACL 缓存',
    ja: 'ACLキャッシュを有効にしますか',
    en: 'Whether to enable ACL cache',
  },
  flapping_detect_policy: {
    zh: '指定全局的 flapping detect 策略',
    ja: 'グローバルのflapping detect 策略を指定します',
    en: 'Specify the global flapping detect policy',
  },
  mqtt_strict_mode: {
    zh: '是否在严格模式下解析 MQTT 帧',
    ja: '厳密（strict）モードでMQTTフレームを解析しますか',
    en: 'Whether to parse the MQTT frame in strict mode',
  },
  // 集群设置字段
  invite: {
    zh: '邀请',
    ja: '招待',
    en: 'Invite',
  },
  inviteSuccess: {
    zh: '邀请成功',
    ja: '招待が成功しました',
    en: 'Invite Success',
  },
  clusterType: {
    zh: '集群方式',
    ja: 'タイプ',
    en: 'Cluster Type',
  },
  currentNode: {
    zh: '当前节点',
    ja: 'カレントノード',
    en: 'Current Node',
  },
  nodeRequired: {
    zh: '请输入节点名称',
    ja: 'ノード名を入力してください',
    en: 'Please enter the node name',
  },
  dnsName: {
    zh: 'DNS 名称',
    ja: 'DNS 名',
    en: 'DNS',
  },
  app: {
    zh: '节点前缀',
    ja: 'ノード接頭辞',
    en: 'Node Prefix',
  },
  app_desc: {
    zh: '用于自动使用 IP 地址构造节点名称如：${name}@127.0.0.1',
    ja: '自動的にIPアドレスでノード名を作るために使用します。ノード名の例：${name}@127.0.0.1',
    en: 'Used to automatically construct a node name using an IP address: ${name}@127.0.0.1',
  },
  addr: {
    zh: '组播地址',
    ja: 'マルチキャストリスト',
    en: 'Multicast Address',
  },
  ports: {
    zh: '端口列表',
    ja: 'ポートリスト',
    en: 'Ports',
  },
  iface: {
    zh: '多播地址',
    ja: 'Iface',
    en: 'Iface',
  },
  ttl: {
    zh: '多播 TTL',
    ja: 'TTL',
    en: 'TTL',
  },
  loop: {
    zh: '循环多播',
    ja: 'ループ',
    en: 'Loop',
  },
  server: {
    zh: 'Etcd 服务器',
    ja: 'Etcd サーバー',
    en: 'Etcd Server',
  },
  prefix: {
    zh: '路径前缀',
    ja: 'パス接頭辞',
    en: 'Path Prefix',
  },
  prefix_desc: {
    zh: '用于构造节点路径，路径为 v2/keys/<prefix>/<cluster.name>/<node.name>',
    ja: 'ノードパスを作るために使用します。パスは v2/keys/<prefix>/<cluster.name>/<node.name>',
    en: 'Used to construct a node path with v2/keys/<prefix>/<cluster.name>/<node.name>',
  },
  apiserver: {
    zh: 'k8s 服务器列表',
    ja: 'k8s サーバーリスト',
    en: 'k8s server list',
  },
  service_name: {
    zh: '服务器名称',
    ja: 'サーバー名',
    en: 'Service Name',
  },
  address_type: {
    zh: '地址类型',
    ja: 'アドレスタイプ',
    en: 'Address Type',
  },
  address_type_desc: {
    zh: '用于从 k8s 服务中提取主机名',
    ja: 'k8sサーバーにホスト名を取得するために使用します',
    en: 'Used to get hostname from the k8s service',
  },
  app_name: {
    zh: '节点前缀',
    ja: 'アプリ名',
    en: 'App Name',
  },
  app_name_desc: {
    zh: '用于构造节点名称',
    ja: 'ノード名の作成を使用します',
    en: 'Used to construct the node name',
  },
  namespace: {
    zh: 'k8s 命名空间',
    ja: 'k8sの名前空間',
    en: 'k8s Namespace',
  },
  suffix: {
    zh: '主机后缀',
    ja: 'サフィックス',
    en: 'Suffix',
  },
  manual: {
    zh: '手动集群',
    ja: 'マニアルクラスター',
    en: 'Manual cluster',
  },
  dns: {
    zh: 'DNS A 记录自动集群',
    ja: 'DNS A レコード自動クラスター',
    en: 'DNS A record automatic cluster',
  },
  static: {
    zh: '静态节点列表自动集群',
    ja: '静的ノードリスト自動クラスター',
    en: 'Static node list automatic cluster',
  },
  mcast: {
    zh: 'UDP 组播自动集群',
    ja: 'UDPマルチキャスト自動クラスター',
    en: 'UDP multicast automatic cluster',
  },
  etcd: {
    zh: '通过 etcd 自动集群',
    ja: 'etcdによって自動クラスター',
    en: 'By etcd automatic cluster',
  },
  k8s: {
    zh: 'Kubernetes 服务自动集群',
    ja: 'Kubernetesサービスの自動クラスター',
    en: 'Kubernetes service automatic cluster',
  },
  joined: {
    zh: '已加入',
    ja: '参加しました',
    en: 'Joined',
  },
  notJoined: {
    zh: '待加入',
    ja: '参加を待っています',
    en: 'Waiting to join',
  },
  zoneName: {
    zh: 'Zone 名字',
    ja: '待翻译',
    en: 'Zone Name',
  },
  zoneNameTip: {
    zh: '名字不能为空！',
    ja: '待翻译',
    en: 'The name cannot be empty!',
  },
  listeners: {
    zh: '监听器',
    ja: 'リスナー',
    en: 'Listeners',
  },
  monitorAlarm: {
    zh: '监控告警',
    ja: '待翻译',
    en: 'Monitor Alarm',
  },
  // monitorAlarm desciption start
  actions: {
    zh: '动作',
    ja: '待翻译',
    en: 'Actions',
  },
  size_limit: {
    zh: '大小限制',
    ja: '待翻译',
    en: 'Size Limit',
  },
  validity_period: {
    zh: '有效期',
    ja: '待翻译',
    en: 'Validity period',
  },
  check_interval: {
    zh: 'CPU 占用率检查周期',
    ja: '待翻译',
    en: 'CPU usage check cycle',
  },
  process_high_watermark: {
    zh: '当前进程数量占进程最大数量的百分比超过该值时将触发告警',
    ja: '待翻译',
    en: `
    When the percentage of the current number of processes to the maximum number
    of processes exceeds this value, an alarm will be triggered`,
  },
  process_low_watermark: {
    zh: '当前进程数量占进程最大数量的百分比回落到该值以下时将触发告警',
    ja: '待翻译',
    en: `
    An alarm will be triggered when the percentage of the current number of
    processes in the maximum number of processes falls below this value`,
  },
  busy_dist_port: {
    zh: '指定是否启用集群 RPC 通道拥塞监控',
    ja: '待翻译',
    en: 'Specify whether to enable cluster RPC channel congestion monitoring',
  },
  busy_port: {
    zh: '指定是否启用进程间消息通道拥塞监控',
    ja: '待翻译',
    en: 'Specify whether to enable inter-process message channel congestion monitoring',
  },
  large_heap: {
    zh: '启用堆栈大小监控并在进程执行垃圾回收后堆栈大小仍大于设定值时触发告警，0 表示禁用此监控',
    ja: '待翻译',
    en: `
    Enable stack size monitoring and trigger an alarm when the stack size is
    still greater than the set value after the process is garbage collected, 0 means disable this monitoring`,
  },
  long_gc: {
    zh: '启用垃圾回收时间监控并在回收时间超过设定值时触发告警，0 表示禁用此监控',
    ja: '待翻译',
    en: `
    Enable garbage collection time monitoring and trigger an alarm
    when the collection time exceeds the set value, 0 means disable this monitoring`,
  },
  long_schedule: {
    zh: '启用进程调度时间监控并在调度时间超过设定值时触发告警，0 表示禁用此监控',
    ja: '待翻译',
    en: `
    Enable process scheduling time monitoring and trigger an alarm when the
    scheduling time exceeds the set value, 0 means disable this monitoring`,
  },
  cpu_check_interval: {
    zh: 'CPU 占用率检查周期',
    ja: '待翻译',
    en: 'CPU usage check cycle',
  },
  cpu_high_watermark: {
    zh: 'CPU 占用率超过该值时将触发告警',
    ja: '待翻译',
    en: 'An alarm will be triggered when the CPU usage exceeds this value',
  },
  cpu_low_watermark: {
    zh: 'CPU 占用率回落到该值以下时将清除告警',
    ja: '待翻译',
    en: 'The alarm will be cleared when the CPU usage falls below this value',
  },
  mem_check_interval: {
    zh: '内存占用率检查周期',
    ja: '待翻译',
    en: 'Memory usage check cycle',
  },
  procmem_high_watermark: {
    zh: 'EMQ X 为单个进程分配的内存占系统内存的百分比超过该值时将触发告警',
    ja: '待翻译',
    en: `
    EMQ X will trigger an alarm when the percentage of system
    memory allocated by EMQ X for a single process exceeds this value`,
  },
  sysmem_high_watermark: {
    zh: 'EMQ X 为所有进程分配的内存占系统内存的百分比超过该值时将触发告警',
    ja: '待翻译',
    en: `
    EMQ X will trigger an alarm when the percentage of system
    memory allocated by EMQ X for all processes exceeds this value`,
  },
  // monitorAlarm desciption end
  listenerName: {
    zh: '监听器名字',
    ja: '待翻译',
    en: 'Listener Name',
  },
  listenerType: {
    zh: '监听类型',
    ja: '待翻译',
    en: 'Listener Type',
  },
  // baseSettings start
  broker_session_locking_strategy: {
    zh: `会话锁策略。保证集群中 Client ID 在集群中的创建会话的唯一性。
    all 表示全集群锁，leader 表示仅主节点锁，quorum 多数节点锁，local 表仅当前节点锁`,
    ja: '待翻译',
    en: `Session locking policy. Ensure the uniqueness of the Client ID creation session in the cluster.
    All represents the total set group lock, the leader represents the master node lock only,
    the quorum majority node lock only, and the local table only the current node lock
    `,
  },
  broker_shared_dispatch_ack_enabled: {
    zh: '共享订阅开启内部派发 ACK',
    ja: '待翻译',
    en: 'Shared subscriptions enable internal distribution ACK',
  },
  broker_shared_subscription_strategy: {
    zh: '共享订阅派发策略',
    ja: '待翻译',
    en: 'Shared subscription distribution policies',
  },
  broker_sys_heartbeat: {
    zh: 'Broker 健康状态发布间隔',
    ja: '待翻译',
    en: 'Broker Health status publish interval',
  },
  broker_sys_interval: {
    zh: 'Broker 统计信息发布间隔',
    ja: '待翻译',
    en: 'Broker statistics release interval',
  },
  // baseSettings end
  confirmUpdateListener: {
    zh: '应用设置将重新启动监听器，该操作将导致当前活跃连接断开，是否继续？',
    ja: '待翻译',
    en: `
    Applying settings will restart the listener.
    This operation will cause the current active connection to be disconnected.
    Do you want to continue?`,
  },
  isOpened: {
    zh: '是否开启',
    ja: '待翻译',
    en: 'Is Started',
  },
  isStopListener: {
    zh: '确定停止监听器：',
    ja: '待翻译',
    en: 'Are you sure to stop the listener:',
  },
  isDeleteListener: {
    zh: '确认删除该监听器？',
    ja: '待翻译',
    en: 'Are you sure to delete this listener?',
  },
  isDeleteZone: {
    zh: '确认删除该 Zone？',
    ja: '待翻译',
    en: 'Are you sure to delete this Zone?',
  },
  returnList: {
    zh: '返回列表',
    ja: '待翻译',
    en: 'Back',
  },
  portRangeTip: {
    zh: '端口不能为负数且不能大于 65535',
    en: 'The port cannot be negative and cannot be greater than 65535',
    ja: '待翻译',
  },
  openModuleTip: {
    zh: `开启热配置后，EMQ X 将从配置文件中拷贝一份配置副本，所有可在 Dashboard 修改的配置都会持久化到磁盘中。
    <br>如果修改配置文件将会覆盖热配置，请谨慎使用。`,
    en: `After enabling hot configuration, EMQ X will copy a configuration from the configuration file,<br>
    and all configurations that can be modified on the Dashboard will be persisted to the disk.<br>
    If modifying the configuration file will overwrite the hot configuration, please use it with caution.`,
    ja: '待翻译',
  },
}
