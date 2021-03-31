require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

const errorHandler = (err, req, res, next) => {
	console.log(err.message)

	if (err.name === "CastError") {
		return res.status(400).send({ error: "malformatter id" })
	}

	if (err.name === "ValidationError") {
		return res.status(400).send({ error: "person name must be unique" })
	}

	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unkown endpoint" })
}

morgan.token("custom", (req, res) => {
	return JSON.stringify(req.body)
})

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :custom"
	)
)

app.get("/api/persons", (req, res) => {
	Person.find({}).then(people => res.json(people))
})

app.get("/api/persons/:id", (req, res, next) => {
	const id = req.params.id
	Person.findById(id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(err => {
			console.log("no such person with given id")
			next(err)
		})
})

app.post("/api/persons", (req, res, next) => {
	const contact = req.body
	if (!contact.name || !contact.number) {
		return res.send({ error: "name or number is missing" })
	}

	const person = new Person({
		name: contact.name,
		number: contact.number,
	})

	person
		.save()
		.then(savedContact => res.json(savedContact))
		.catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => res.json(updatedPerson))
		.catch(err => next(err))
})

app.get("/info", (req, res) => {
	Person.find({}).then(persons => {
		const info = `Phonebook has info for ${persons.length} people`
		const today = new Date()
		const date = String(today)
		res.send(`<p>${info}</p><p>${date}</p>`)
	})
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
