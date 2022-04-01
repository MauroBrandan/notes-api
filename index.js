const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let notes = [
	{
		id: 1,
		content: 'Lorem ipsum dolor sit amet cndae velit illum minu',
		date: '2022-03-30T17:05:41.441Z',
		important: true,
	},
	{
		id: 2,
		content: 'Lorem ipsum dolor sit amet cndae velit illum minu',
		date: '2022-03-30T17:06:41.441Z',
		important: true,
	},
	{
		id: 3,
		content: 'Lorem ipsum dolor sit amet cndae velit illum minu',
		date: '2022-03-30T17:07:41.441Z',
		important: false,
	},
]

app.get('/', (request, response) => {
	response.send('<h1>Notes API</h1>')
})

app.get('/api/notes', (request, response) => {
	response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
	const id = Number(request.params.id)
	const note = notes.find((note) => note.id === id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/notes/:id', (request, response) => {
	const id = Number(request.params.id)
	notes = notes.filter((note) => note.id != id)
	response.status(204).end()
})

app.post('/api/notes', (request, response) => {
	const note = request.body

	if (!note || !note.content) {
		return response.status(400).json({
			error: 'note or note.content is missing',
		})
	}

	const ids = notes.map((note) => note.id)
	const MaxId = Math.max(...ids)

	const newNote = {
		id: MaxId + 1,
		content: note.content,
		date: new Date().toISOString(),
		important: typeof note.important !== 'undefined' ? note.important : false,
	}

	notes = [...notes, newNote]
	response.status(201).json(newNote)
})

app.use((request, response) => {
	response.status(404).json({
		error: 'Not found',
	})
})

const PORT = process.env.PORT || 3005
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
