import express from "express";
import db from "./config/mongoose.js";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());
// app.use(express.urlencoded());
app.listen(3000, () => {
	console.log("Server is running at port 3000");
});

app.use("/user", userRouter);
app.use("/api/auth", authRouter);
