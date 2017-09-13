const express = require('express')
const app = express()
const getRawBody = require('raw-body')
const flatbuffers = require('flatbuffers').flatbuffers
const chatGroup = require('../js/Group_generated')
const user_generated = require('../js/User_generated')
chatGroup.Chat.Sample.User = user_generated.Chat.Sample.User

app.use((req, res, next) => {
	if (req.headers['content-type'] === 'application/octet-stream') {
		getRawBody(req, {
			length: req.headers['content-length'],
			encoding: this.charset
		}, (err, string) => {
			if (err)
				return next(err)

			req.body = string
			next()
		})
	} else {
		next()
	}
})

app.post('/', (req, res) => {

	try {
		var buff = new flatbuffers.ByteBuffer(req.body);
		var cg = chatGroup.Chat.Sample.Group.getRootAsGroup(buff)

		var group = {};

		console.log("Chat Group ", cg.name())
		group.name = cg.name()

		console.log("Users online: ", cg.usersLength())
		group.usersConnected = cg.usersLength()

		console.log("Max users online: ", cg.maxSize())
		group.maxUsers = cg.maxSize()

		group.users = []

		for(var i = 0; i < cg.usersLength(); i++) {
			var user = cg.users(i);
			var _user = {};

			console.log("----------- Start Users connected -----------")
			console.log("Firstname: ", user.firstName())
			_user.firstName = user.firstName()

			console.log("Lastname: ", user.lastName())
			_user.lastName = user.lastName()

			console.log("Address1: ", user.address1())
			_user.address1 = user.address1()

			console.log("Address2: ", user.address2())
			_user.address2 = user.address2()

			console.log("Phone: ", user.phone())
			_user.phone = user.phone()
			
			console.log("Age: ", user.age())
			_user.age = user.age()

			console.log("Email: ", user.email())
			_user.email = user.email()

			switch(user.emailHost()) {
				case user_generated.Chat.Sample.EmailHost.Gmail:
					console.log("Gmail host")
					_user.emailHost = "Gmail"
					break
				case user_generated.Chat.Sample.EmailHost.Hotmail:
					console.log("Hostmail host")
					_user.emailHost = "Hostmail"
					break
				case user_generated.Chat.Sample.EmailHost.Yahoo:
					console.log("Yahoo host")
					_user.emailHost = "Yahoo"
					break
				case user_generated.Chat.Sample.EmailHost.Other:
					console.log("Other host")
					_user.emailHost = "Other Email Host"
					break
			}

			switch(user.country()) {
				case user_generated.Chat.Sample.Country.UnitedState:
					console.log("Country: United State")
					_user.country = "United State"
					break
				case user_generated.Chat.Sample.Country.Argentina:
					console.log("Country: Argentina")
					_user.country = "Argentina"
					break
				case user_generated.Chat.Sample.Country.Colombia:
					console.log("Country: Colombia")
					_user.country = "Colombia"
					break
				case user_generated.Chat.Sample.Country.Venezuela:
					console.log("Country: Venezuela")
					_user.country = "Venezuela"
					break
				case user_generated.Chat.Sample.Country.Peru:
					console.log("Country: Peru")
					_user.country = "Peru"
					break
				case user_generated.Chat.Sample.Country.Ecuador:
					console.log("Country: Ecuador")
					_user.country = "Ecuador"
					break
				case user_generated.Chat.Sample.Country.Canada:
					console.log("Country: Canada")
					_user.country = "Canada"
					break
				case user_generated.Chat.Sample.Country.Italia:
					console.log("Country: Italia")
					_user.country = "Italia"
					break
				case user_generated.Chat.Sample.Country.Chile:
					console.log("Country: Chile")
					_user.country = "Chile"
					break
			}

			switch(user.userType()) {
				case user_generated.Chat.Sample.Type.Admin:
					console.log("User Type: Admin")
					_user.type = "admin"
					break
				case user_generated.Chat.Sample.Type.Normal:
					console.log("User Type: Normal")
					_user.type = "normal"
					break
			}

			console.log("----------- Start Users connected -----------")
			group.users.push(_user)
		}

		res.json({
			error: "",
			group: group
		})
	} catch(err) {
		res.json({
			error: "weard error happened",
			group: null,
		})
	}

	process.exit(0)
})

app.listen(process.env.PORT | 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT | 3000}`)
})