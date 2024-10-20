import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const customerSchema = new mongoose.Schema({
	_id: { type: String, default: uuidv4, required: true },
	customerName: { type: String, required: true },
	password: { type: String, required: true },
	mobile: { type: String, required: true },
	email: { type: String, required: true },
	address: { type: String, required: true },
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
});

export const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
