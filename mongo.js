const mongoose = require('mongoose')

const conecctionString = process.env.MONGO_DB_URI

mongoose
	.connect(conecctionString)
	.then(() => {
		console.log('Database connected')
	})
	.catch((err) => {
		console.error(err)
	})

process.on('uncaughtException', () => {
	mongoose.connection.close()
})
