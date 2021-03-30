require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

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

app.get("/api/persons/:id", (req, res) => {
	const id = req.params.id
	Person.findById(id)
		.then(person => res.json(person))
		.catch(err => {
			console.log("no such person with given id")
			res.status(404).end()
		})
})

app.post("/api/persons", (req, res) => {
	const contact = req.body
	if (!contact.name || !contact.number) {
		return res.send({ error: "name or number is missing" })
	}

	const person = new Person({
		name: contact.name,
		number: contact.number,
	})

	person.save().then(savedContact => res.json(savedContact))
})

app.delete("/api/persons/:id", (req, res) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(err => res.status(500).end())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
