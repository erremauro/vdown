const fs = require('fs')
const path = require('path')
const url = require('url')
const https = require('https')
const util = require('util')
const shell = require('any-shell-escape')
const ffmpeg = require('ffmpeg-static')
const exec = util.promisify(require('child_process').exec)
const unlink = util.promisify(fs.unlink)

module.exports = {
	getJson,
	processFile,
	combineSegments,
	combineFiles
}

/////////////////////////////

/**
 * Download each segments and combines them into a single output file
 * @param  {String} baseURL  The URL to be downloaded
 * @param  {String} initData Initial file stream data
 * @param  {Array<Object>} segments Segments informations
 * @param  {String} filename Output filename
 * @return {Promise}
 */
function processFile(baseURL, initData, segments, filename) {
	return new Promise((resolve, reject) => {
		const segmentsURL = segments.map(segment => baseURL + segment.url)
		const initBuffer = Buffer.from(initData, 'base64')

		fs.writeFileSync(filename, initBuffer)

		const output = fs.createWriteStream(filename, { flags: 'a' })
		const promise = Promise.resolve()
		const reducer = (promise, URL) => 
			promise.then(() => combineSegments(URL, output))

		return segmentsURL.reduce(reducer, promise)
			.then(() => output.end())
			.then(() => resolve())
	})
}

/**
 * Download segment data and write it to the given output stream
 * @param  {String} segmentURL Segment URL to be downloaded
 * @param  {Stream} output     Output stream to be written on
 * @return {Promise}
 */
function combineSegments(segmentURL, output) {
	return new Promise((resolve, reject) => {
		https.get(segmentURL, response => {
			response.on('data', data => output.write(data))
			response.on('end', () => resolve())
		})
		.on('error', err => {
			reject(err)
		})
	})
}

/**
 * Combine audio and video files using ffmpeg command (requires ffmpeg)
 * @param {String} clipId  Source clip id
 * @param {String} out     Output file path
 * @return {Promise}
 */
function combineFiles(clipId, out) {
	const video = `./${clipId}.m4v`
	const audio = `./${clipId}.m4a`

	if (fs.existsSync(out)) {
		fs.unlinkSync(out)
	}

	const cmd = shell([
		ffmpeg, '-i', audio, '-i', video, '-vcodec', 'copy', '-acodec', 'copy', out
	])

	// const cmd = `ffmpeg -i ${video} -i ${audio} -vcodec copy -acodec copy "${out}"`
	return exec(cmd)
		.then(() => unlink(video))
		.then(() => unlink(audio))
}

/**
 * Get the json from the given URL
 * @param  {String} URL - json file URL
 * @return {Promise<JSON>} - Return a JSON object on resolve
 */
function getJson(URL) {
	return new Promise((resolve, reject) => {
		let jsonData = ''

		https.get(URL, response => {
			response.on('data', data => jsonData += data)
			response.on('end', () => resolve(JSON.parse(jsonData)))
		})
		.on('error', err => {
			reject(err)
		})
	})
}