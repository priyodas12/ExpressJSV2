let validateEnv = (mongoUri, port) => {
	console.log(mongoUri, port);
	if (!mongoUri) {
		throw new Error('MONGO_URI is not defined');
	}
	if (!port) {
		throw new Error('PORT is not defined');
	}
};

export default validateEnv;
