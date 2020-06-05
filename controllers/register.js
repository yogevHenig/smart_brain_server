const session = require('./session');

const handleRegister = (req, res, db, bcrypt) => {
	const { email , name, password } = req.body;
	if(!email || !name || !password){
		return res.status(400).json('incorrect form subbmition');
	}

	const hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					return user[0].id && user[0].email ? session.createSessions(user[0]) : Promise.reject(user)
				})
				.then(session => {
					res.json(session)
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister : handleRegister
}