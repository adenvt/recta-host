<template>
    <div class="row">
        <div class="twelve columns">
            <label>VID <i>( optional )</i></label>
            <input class="u-full-width" type="text" placeholder="Vendor ID" v-model="config.vid">
        </div>
        <div class="twelve columns">
            <label>PID <i>( optional )</i></label>
            <input class="u-full-width" type="text" placeholder="Product ID" v-model="config.pid">
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        props: ['data'],
        data() {
            return {
                config: {
                    vid: this.data.vid || '',
                    pid: this.data.pid || '',
                }
            }
        },
        watch: {
            config: {
                deep: true,
                handler() {
                    this.$emit('change', this.config)
                }
            }
        }
    }
</script>
