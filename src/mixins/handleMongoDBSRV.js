import { booleanFieldValueToBoolean, setAFieldRequired } from '@/common/utils'

const RESOURCE_NAME = 'backend_mongo_rs'
const MODULE_TYPE = 'mongo_authentication'

export default (type = 'resource') => {
  return {
    computed: {
      srvRecord() {
        const srvRecord = this.record && this.record.config && this.record.config.srv_record
        return srvRecord === undefined ? srvRecord : booleanFieldValueToBoolean(srvRecord)
      },
    },

    watch: {
      srvRecord() {
        this.setRsSetNameFieldRequired()
      },
    },

    methods: {
      setRsSetNameFieldRequired() {
        const isTarget = type === 'module' ? this.moduleData.type === MODULE_TYPE : this.record.name === RESOURCE_NAME
        if (!isTarget || this.srvRecord === undefined) {
          return
        }
        if (this.rules && this.rules.config && this.rules.config.rs_set_name) {
          this.rules.config.rs_set_name = setAFieldRequired(this.rules.config.rs_set_name, !this.srvRecord)
        }
      },
    },
  }
}
