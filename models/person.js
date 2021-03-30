const mongoose = require("mongoose")

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(res => console.log("connected to db"))
	.catch(err =>
		console.log("error occured while connecting to DB", err.message)
	)

const PersonSchema = new mongoose.Schema({
	name: String,
	number: String,
})

PersonSchema.set("toJSON", {
	transform: (document, obj) => {
		obj.id = document._id.toString()
		delete obj._id
		delete obj.__v
	},
})

module.exports = mongoose.model("Person", PersonSchema)
