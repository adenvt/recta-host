<template>
    <div class="row">
        <div class="twelve columns">
            <label>IP Address</label>
            <input class="u-full-width" type="text" placeholder="Host / IP Address" v-model="config.address">
        </div>
        <div class="twelve columns">
            <label>Port</label>
            <input class="u-full-width" type="text" placeholder="Port" v-model="config.port">
        </div>
    </div>
</template>

<script type="text/javascript">
import _ from 'lodash'

export default {
  props: ['data'],
  data () {
    return {
      config: {
        address: this.data.address,
        port   : this.data.port,
      },
    }
  },
  created () {
    _.assign(this.config, _.defaults(this.data, {
      address: 'localhost',
      port   : 9100,
    }))
  },
  watch: {
    config: {
      deep: true,
      handler () {
        this.$emit('change', this.config)
      },
    },
  },
}
</script>
