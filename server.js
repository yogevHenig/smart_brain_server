const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

// to be able to do body parsing
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// define app to use cors
app.use(cors());

const dataBase = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		},		
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}


app.get('/', (req, res)=> {
	res.json(dataBase.users);
});


app.post('/signin', (req, res)=> {

	// bcrypt.compare("veggies", hash, function(err, res) {
	//     // res = false
	// });

	if (req.body.email === dataBase.users[0].email && 
		  req.body.password === dataBase.users[0].password) {
		res.json(dataBase.users[0]);
	} else {

		//status 400 - bad request
		res.status(400).json('error logging in');
	}
});


app.post('/register', (req, res)=> {
	const { email , name, password } = req.body;

	console.log(email);

	// bcrypt.hash(password, null, null, function(err, hash) {
 //    console.log(hash);
	// });

	dataBase.users.push({
			id: '125',
			name: name,
			email: email,
			entries: 0,
			joined: new Date()
		});

	// return the user that just registered
	res.json(dataBase.users[dataBase.users.length - 1]);
});


app.get('/profile/:id', (req, res)=> {
	const { id } = req.params;
	let found = false;
	dataBase.users.forEach(user=> {
		if (user.id === id)
		{
			found = true;
			return res.json(user);
		}
	});
	if (!found){
		res.status(400).json("not found");	
	}
})


app.put('/image', (req, res)=> {
	const { id } = req.body;
	let found = false;
	dataBase.users.forEach(user=> {
		if (user.id === id)
		{
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found){
		res.status(400).json("not found");	
	}
})







// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });



















app.listen(3000, ()=> {
	console.log('app is running on port 3000');
});

