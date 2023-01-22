const express = require('express')
const cors = require('cors')

const app = express()

const logger = require('./logerMiddleware')

app.use(cors())

app.use(express.json())

app.use(logger)

app.use((req, res, next) => {
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  console.log('------')
  next()
})

let notes = [
  { id: 1, content: 'content 1', date: '2023-01-22T03:35:23.955Z', important: true },
  { id: 2, content: 'content 2', date: '2023-01-22T03:36:23.955Z', important: false }
]

app.get('/healthcheck', (req, res) => {
  res.send('UP!!!')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id === id)

  if (note) {
    return res.status(200).json(note)
  }
  return res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log({ id })
  notes = notes.filter((note) => note.id !== id)

  console.log({ notes })
  return res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({ error: 'missing params' })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)
  // const noteExits notes.find(note => note.id === id)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]
  res.json(newNote)
})

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
