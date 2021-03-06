const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const MONGO_URI = process.env.MONGO_URI

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log("connected to db"))
	.catch(err =>
		console.log("error occured while connecting to DB", err.message)
	)

const PersonSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		unique: true,
	},
	number: {
		type: String,
		minLength: 8,
		require: true,
	},
})

PersonSchema.plugin(uniqueValidator)

PersonSchema.set("toJSON", {
	transform: (document, obj) => {
		obj.id = document._id.toString()
		delete obj._id
		delete obj.__v
	},
})

module.exports = mongoose.model("Person", PersonSchema)
