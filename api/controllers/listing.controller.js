import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// Controller function to Create own listing

export const createListing = async (req, res, next) => {
	try {
		// console.log(req.body);
		// req.body.userRef = req.user.id;
		const listing = await Listing.create(req.body);

		return res.status(201).json(listing);
	} catch (error) {
		next(error);
	}
};

// Controller function to Delete User's own listing
export const deleteListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id);

	if (!listing) {
		return next(errorHandler(404, "Listing not Found!"));
	}

	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, "You can only delete your own listing!"));
	}

	res.status(200).json("Deleted");
	try {
		await Listing.findByIdAndDelete(req.params.id);
	} catch (error) {
		next(error);
	}
};

// Controller function to update User's own listing
export const updateListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id);

	if (!listing) {
		return next(errorHandler(404, "Listing not Found!"));
	}

	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, "You can only update your own listing!"));
	}

	try {
		const updatedListing = await Listing.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);

		res.status(200).json(updatedListing);
	} catch (error) {
		next(error);
	}
};

//Get one listing by Id
export const getListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id);
		if (!listing) {
			return next(errorHandler(404, "Listing not found!"));
		}

		res.status(200).json(listing);
	} catch (error) {
		next(error);
	}
};
