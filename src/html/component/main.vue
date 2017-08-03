<style type="text/css">
	hr {
		margin: 1rem 0;
	}
	#logs {
		height: 10rem;
		margin: 1rem 0;
		padding: .2rem .5rem;
		font-size: 90%;
		white-space: pre;
		background: #F1F1F1;
		border: 1px solid #E1E1E1;
		border-radius: 4px;
		overflow: auto;
	}
</style>

<template>
	<form action="" id="settings">
		<div class="row">
			<div class="twelve columns">
				<label>Printer Adapter</label>
				<select class="u-full-width" v-model="printer.adapter">
					<option value="usb">USB</option>
					<option value="serial">Serial</option>
					<option value="network">LAN Network</option>
				</select>
			</div>
		</div>
		<component :is="printer.adapter" :data="printer.option" @change="optionChange"></component>
		<hr>
		<div class="row">
			<div class="twelve columns">
				<label>App Key</label>
				<input class="u-full-width" type="text" placeholder="Application Key" v-model="app.key">
			</div>
			<div class="twelve columns">
				<label>App Port</label>
				<input class="u-full-width" type="text" placeholder="Service Run on Port" v-model="app.port">
			</div>
			<div class="twelve columns">
				<label>
					<input type="checkbox" v-model="app.startup" />
					<span class="label-body">Autostart on startup</span>
				</label>
			</div>
		</div>
		<div class="row">
			<div class="twelve columns">
				<button class="button-default" @click.prevent="save">Save</button>
				<button class="button-default" @click.prevent="toggle">{{ isStart ? 'Stop' : 'Start' }}</button>
				<button class="button-default" @click.prevent="test" v-show="isStart">Test Print</button>
			</div>
		</div>
		<div class="row">
			<div class="twelve columns">
				<label>Log</label>
				<div class="u-full-width" id="logs">{{ logs.join('\n') }}</div>
				<button class="button-default" @click.prevent="clearLog">Clear Logs</button>
			</div>
		</div>
	</form>
</template>

<script adapter="text/javascript">
	import _ from 'lodash'
	import Service from '../../js/service.js'
	import Usb from './setting/usb.vue'
	import Serial from './setting/serial.vue'
	import Network from './setting/network.vue'
	import { CFG, PRINT_TEST } from '../../js/constant.js'

	export default {
		components: { Usb, Serial, Network },
		data() {
			return {
				printer: {
					adapter: 'usb',
					option: {},
				},
				app: {
					startup: false,
					port: 1811,
					key: _.random(1000000000, 9999999999).toString(),
				},
				service: null,
				isStart: false,
				logs: [],
			}
		},
		created() {
			_.assign(this.$data, CFG.get())
		},
		mounted() {
			if (this.app.startup)
				this.start()
		},
		methods: {
			save() {
				CFG.set('printer', this.printer)
				CFG.set('app', this.app)

				this.log('Config Saved')
			},
			toggle() {
				(!this.isStart)
					? this.start()
					: this.stop()
			},
			start() {
				try {
					this.service = new Service()
					this.service.on('open', () => {
						this.isStart = true;

						this.log('Service Started')
					})
					this.service.on('close', () => {
						this.isStart = false;
						this.service = null

						this.log('Service Stoped')
					})
					this.service.on('message', () => {
						this.log('Receive printing message')
					})
					this.service.on('error', (e) => {
						this.log(e)
					})
					this.service.start().catch((e) => {
						this.log(e)
					})
				} catch (e) {
					this.log(e)
				}
			},
			stop() {
				try {
					this.service.stop()
				} catch (e) {
					this.log(e)
				}
			},
			test() {
				try {
					this.service.printer.print(PRINT_TEST)
				} catch (e) {
					this.log(e)
				}
			},
			optionChange(option) {
				_.assign(this.printer.option, option)
			},
			log(text) {
				const date = new Date()

				this.logs.unshift(`${date.toLocaleString()} : ${text} !`)
			},
			clearLog() {
				this.logs = []
			}
		}
	}
</script>
