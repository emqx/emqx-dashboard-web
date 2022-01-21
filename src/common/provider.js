import lang from '@/i18n'
import store from '@/stores'

const local = store.state.lang
const VueI18n = lang[local]

export const ruleEngineProvider = [
  {
    name: 'clientid',
    documentation: VueI18n.RuleEngine.clientid_doc,
    type: 'Field',
    default: 'c_emqx',
    valueType: 'string',
  },
  {
    name: 'username',
    documentation: VueI18n.RuleEngine.username_doc,
    type: 'Field',
    default: 'u_emqx',
    valueType: 'string',
  },
  {
    name: 'event',
    documentation: VueI18n.RuleEngine.event_doc,
    type: 'Field',
    default: 'disconnect',
    valueType: 'string',
  },
  {
    name: 'id',
    documentation: VueI18n.RuleEngine.id_doc,
    type: 'Field',
    default: '--',
    valueType: 'string',
  },
  {
    name: 'payload',
    documentation: VueI18n.RuleEngine.payload_doc,
    type: 'Field',
    default: '{"msg": "hello"}',
    valueType: 'string',
  },
  {
    name: 'peername',
    documentation: VueI18n.RuleEngine.peername_doc,
    type: 'Field',
    default: '127.0.0.1:63412',
    valueType: 'string',
  },
  {
    name: 'qos',
    documentation: VueI18n.RuleEngine.qos_doc,
    type: 'Field',
    default: 1,
    valueType: 'integer',
  },
  {
    name: 'timestamp',
    documentation: VueI18n.RuleEngine.timestamp_doc,
    type: 'Field',
    default: 1576549961086,
    valueType: 'integer',
  },
  {
    name: 'topic',
    documentation: VueI18n.RuleEngine.topic_doc,
    type: 'Field',
    default: 't/a',
    valueType: 'string',
  },
  {
    name: 'node',
    documentation: VueI18n.RuleEngine.node_doc,
    type: 'Field',
    default: 'emqx@127.0.0.1',
    valueType: 'string',
  },
  {
    name: '"$events/message_delivered"',
    documentation: VueI18n.RuleEngine.message_delivered,
    type: 'Method',
  },
  {
    name: '"$events/message_acked"',
    documentation: VueI18n.RuleEngine.message_acked,
    type: 'Method',
  },
  {
    name: '"$events/message_dropped"',
    documentation: VueI18n.RuleEngine.message_dropped,
    type: 'Method',
  },
  {
    name: '"$events/client_connected"',
    documentation: VueI18n.RuleEngine.client_connected,
    type: 'Method',
  },
  {
    name: '"$events/client_disconnected"',
    documentation: VueI18n.RuleEngine.client_disconnected,
    type: 'Method',
  },
  {
    name: '"$events/session_subscribed"',
    documentation: VueI18n.RuleEngine.session_subscribed,
    type: 'Method',
  },
  {
    name: '"$events/session_unsubscribed"',
    documentation: VueI18n.RuleEngine.session_unsubscribed,
    type: 'Method',
  },
  {
    name: '"$events/delivery_dropped"',
    documentation: VueI18n.RuleEngine.delivery_dropped,
    type: 'Method',
  },
]

export default []
