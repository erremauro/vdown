class Stopwatch {

	start() {
		this.startDate = new Date()
	}

	stop() {
		if (this.startDate === null) return

		this.endDate = new Date()
		this.time = new Date(this.endDate.getTime() - this.startDate.getTime())
	}

	reset() {
		this.startDate = null
		this.endDate = null
		this.time = null
	}

	getTimeString() {
		const HH = this.time.getHours() - 1
		const mm = this.time.getMinutes()
		const ss = this.time.getSeconds()
		const ms = this.time.getMilliseconds()

		if (HH > 0) return `${HH}.${mm}h`
		if (mm > 0) return `${mm}.${ss}m`
		if (ss > 0) return `${ss}s`
		if (ms > 0) return `${ms}ms`

		return '0ms'
	}
}

module.exports = new Stopwatch()