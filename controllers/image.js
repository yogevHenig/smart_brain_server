const Clarifai = require('clarifai');

const faceDetectionApp = new Clarifai.App({
 apiKey: '40d57faddf1d45c8ba98b54e57ddcafd'
});

const handleApiCall = (req, res) => {
	faceDetectionApp.models
		.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to communicate with api'));
}


const handleImage = (req, res, db)=> {
	const { id } = req.body;

	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}
