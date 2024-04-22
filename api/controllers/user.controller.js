import { log } from "console";
import Listing from "../models/listing.model.js";
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

export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "You can only delete your own account!"));

	try {
		await User.findByIdAndDelete(req.params.id);
		res.clearCookie("access_token").status(200).json("User has been deleted!");
	} catch (error) {
		next(error);
	}
};

export const getUserListing = async (req, res, next) => {
	try {
		if (req.user.id === req.params.id) {
			const listings = await Listing.find({ userRef: req.user.id });

			res.status(200).json(listings);
		} else {
			return next(errorHandler(401, "You can only view your own listings"));
		}
	} catch (error) {
		next(error);
	}
};
