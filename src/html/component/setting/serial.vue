<template>
    <div class="row">
        <div class="twelve columns">
            <label>
                Com Port
                <a id="refresh" href="#" @click.prevent="getPortList">[ Refresh ]</a>
            </label>
            <select class="u-full-width" v-model="config.comport">
                <option value="" selected hidden>-- Select --</option>
                <option v-for="(port, i) in option.comport" :key="i" :value="port.comName">{{ port.comName }}</option>
            </select>
        </div>
        <div class="twelve columns">
            <label>Baudrate</label>
            <select class="u-full-width" v-model="config.baudrate">
                <option value="" selected hidden>-- Select --</option>
                <option v-for="(baud, i) in option.baudrate" :key="i" :value="baud">{{ baud }}</option>
            </select>
        </div>
    </div>
</template>

<script type="text/javascript">
import SerialPort from 'serialport'

export default {
  props: ['data'],
  data () {
    return {
      config: {
        comport : this.data.comport || '',
        baudrate: this.data.baudrate || '',
      },
      option: {
        comport : [],
        baudrate: [
          110, 300, 1200,
          2400, 4800, 9600,
          14400, 19200, 38400,
          57600, 115200,
        ],
      },
    }
  },
  created () {
    this.getPortList()
  },
  watch: {
    config: {
      deep: true,
      handler () {
        this.$emit('change', this.config)
      },
    },
  },
  methods: {
    getPortList (event) {
      if (event && event.target)
        event.target.style.display = 'none'

      SerialPort.list((err, ports) => {
        if (err)
          throw err

        this.option.comport = ports

        if (event && event.target)
          event.target.style.display = 'inline-block'
      })
    },
  },
}
</script>
