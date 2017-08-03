<template>
	<div class="anu">
		<h1>Hello World, {{ name }}</h1>
	</div>
</template>

<script type="text/javascript">
	import SerialPort from 'serialport'

	export default {
		data() {
			return {
				name: 'Ade'
			}
		}
	}
</script>
