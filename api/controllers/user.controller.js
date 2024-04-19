import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
	return res.json({ here: "heer" });
};

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "You can only update your own account!"));

	try {
		if (req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username: req.body.username,
					password: req.body.password,
					email: req.body.email,
					avatar: req.body.avatar,
				},
			},
			{ new: true }
		);

		const { password, ...rest } = updatedUser;

		res.status(200).json(rest);
	} catch (error) {
		return next(error);
	}
};
