require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
	response.send('<h1>Notes API</h1>')
})

app.get('/api/notes', (request, response) => {
	Note.find({})
		.then((notes) => {
			response.json(notes)
		})
		.catch((err) => next(err))
})

app.get('/api/notes/:id', (request, response, next) => {
	const { id } = request.params

	Note.findById(id)
		.then((note) => {
			if (note) {
				return response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch((err) => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
	const { id } = request.params
	const note = request.body

	const newNoteInfo = {
		content: note.content,
		important: note.important,
	}

	Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
		.then((result) => {
			response.json(result)
		})
		.catch((err) => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
	const { id } = request.params

	Note.findByIdAndDelete(id)
		.then(() => {
			response.status(204).end()
		})
		.catch((err) => next(err))
})

app.post('/api/notes', (request, response) => {
	const note = request.body

	if (!note || !note.content) {
		return response.status(400).json({
			error: 'note or note.content is missing',
		})
	}

	const newNote = new Note({
		content: note.content,
		date: new Date(),
		important: note.important,
	})

	newNote
		.save()
		.then((savedNote) => {
			response.status(201).json(savedNote)
		})
		.catch((err) => next(err))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
