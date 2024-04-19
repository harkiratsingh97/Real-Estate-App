import express from "express";
import db from "./config/mongoose.js";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

// app.use(express.urlencoded());
app.listen(8000, () => {
	console.log("Server is running at port 8000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Middleware to catch the errors from Controller functions
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
