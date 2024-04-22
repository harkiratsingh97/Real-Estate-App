import express from "express";

const router = express.Router();

import {
	deleteUser,
	test,
	updateUser,
	getUserListing,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.get("/test", test);

router.post("/update/:id", verifyToken, updateUser);

router.delete("/delete/:id", verifyToken, deleteUser);

router.get("/listings/:id", verifyToken, getUserListing);

export default router;
