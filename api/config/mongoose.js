import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log("Connected to db");
	})
	.catch((err) => {
		console.log(err);
	});

export default mongoose.connection;
