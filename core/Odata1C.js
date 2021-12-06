const axios = require('axios')

class Odata1C {
	constructor (url, username, password) {
		this.url = url + '/odata/standard.odata'
		this.auth = { username, password }		
	}

	async getStandardObjects() {
		return await axios({
			method: 'get',
			url: this.url + '$metadata',
			auth: this.auth
		})
	}

	async getObjects(object1c, param) {
		const filter = param ? '?$filter=' + param : ''

		return await axios({
			method: 'get',
			url: encodeURI(this.url + '/' + object1c + filter),
			auth: this.auth
		}).then(res => res.data.value)
	}

}

module.exports = Odata1C