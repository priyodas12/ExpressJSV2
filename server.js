
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import validateEnv from './envValidation.js';
import { Customer } from './model/customer.js';

const app = express();

app.use(express.json());
dotenv.config();

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

console.log(port, mongoUri);

//used in ES modules to retrieve the current module's filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

validateEnv(mongoUri, port);

//mongoDB Connection
mongoose
	// @ts-ignore
	.connect(mongoUri)
	.then(() => {
		console.log('--------MongoDB Server connected---------');
		console.log('Connection Info:');
		console.log(`Host: ${mongoose.connection.host}`);
		console.log(`Port: ${mongoose.connection.port}`);
		console.log(`Database Name: ${mongoose.connection.name}`);
		console.log('------------------------------------------');
	})
	.catch((err) => console.log('MongoDB connection error:', err));

//set up static folder
//app.use( express.static( path.join( __dirname, 'public' ) ) );

app.listen(port, () =>
	console.log(`Express Server is up and running on ${port}`),
);

app.get('/api/v1/about', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

//save customer
app.post('/api/v1/customers', async (req, res) => {
	const { customerName, status } = req.body;
	console.log(
		'-------------Saving Customer-------------\n->',
		customerName,
		status,
	);
	const password = createHash('sha256')
		.update(randomUUID())
		.digest('hex')
		.toString();
	const encryptedPassword = await bcrypt.hash(password, 10);
	const customer = new Customer({
		customerName: customerName ? customerName : faker.name.fullName(),
		_id: randomUUID().toString(),
		customerId: Math.floor(Math.random() * 9000000000),
		email: faker.internet.email(),
		address: faker.location.streetAddress(),
		createdAt: faker.date.past(),
		password: encryptedPassword,
		isActive: status ? status : true,
		mobile: Math.floor(Math.random() * 9000000000) + 1000000000,
	});

	const customerSaved = await customer.save();

	res.send(customerSaved);

	console.log(
		`Saved customer: \n${customer._id}\n -----------------------------------------`,
	);
});

app.get('/api/v1/customers/:id', async (req, res) => {
	const id = req.params.id;

	console.log('Fetching Customer: {}', id);

	const customerFetched = await Customer.findOne({ customerId: id });

	console.log('CustomerId Fetched: {}', customerFetched?.customerId);

	res.send(customerFetched);
});

app.get('/api/v1/customers', async (req, res) => {
	console.log('\n-----------fetching all customers------------\n');
	const customerFetched = await Customer.find();

	customerFetched.map((customer) =>
		console.log('CustomerId Fetched: ', customer._id),
	);

	res.send(customerFetched);
});