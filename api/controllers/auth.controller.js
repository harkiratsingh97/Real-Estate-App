import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// Controller function to Sign up a new user
export const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const hashedPassword = bcryptjs.hashSync(password, 10);

		const newUser = User({ username, email, password: hashedPassword });

		await newUser.save();

		res.status(201).json({ message: "User created Successfully" });
	} catch (err) {
		res.status(500).json(err.message);
	}
};
