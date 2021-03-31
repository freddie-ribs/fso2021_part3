const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	)
	process.exit(1)
}

if (process.argv.length === 4) {
	console.log("You forgot to provide name or number, please try again")
	process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://meeseeks:${password}@merncluster.bmyyo.mongodb.net/commandlinedb?retryWrites=true&w=majority`

mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log("connected to db"))

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Contact = mongoose.model("Contact", contactSchema)

const contact = new Contact({
	name: process.argv[3],
	number: process.argv[4],
})

if (process.argv.length === 3) {
	Contact.find({}).then(res => {
		console.log("phonebook:")
		res.forEach(person => console.log(`${person.name} ${person.number}`))
		mongoose.connection.close()
	})
}

if (process.argv.length === 5) {
	contact.save().then(() => {
		console.log(`${contact.name} has been added to phonebook`)
		mongoose.connection.close()
	})
}
