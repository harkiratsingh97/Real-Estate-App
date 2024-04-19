import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from "../redux/user/userSlice.js";

const Profile = () => {
	const { currentUser, loading, error } = useSelector(
		(state) => state.userReducer
	);
	const fileRef = useRef();
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileError, setFileError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSucces, setUpdateSuccess] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	console.log(currentUser._id);
	console.log(formData);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setUpdateSuccess(false);

			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}

			dispatch(updateUserSuccess(data._doc));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error));
		}
	};
	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold mt-7">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="file"
					ref={fileRef}
					onChange={(e) => setFile(e.target.files[0])}
					hidden
					accept="image/*"
				/>
				<img
					onClick={() => {
						fileRef.current.click();
					}}
					src={formData.avatar ? formData.avatar : currentUser.avatar}
					className="self-center rounded-full h-24 w-24 object-cover cursor-pointer "
					alt="profile"
				/>
				<p className="text-sm self-center">
					{fileError ? (
						<span className="text-red-700">
							Error Image Upload (image must be less than 2mb)
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="text-slate-700">
							{" "}
							{`Uploading ${filePerc}% `}{" "}
						</span>
					) : filePerc === 100 ? (
						<span className="text-green-700">Image Successfully Uploaded!</span>
					) : (
						""
					)}
				</p>
				<input
					type="text"
					placeholder="Username"
					id="username"
					defaultValue={currentUser.username}
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="Email"
					id="email"
					defaultValue={currentUser.email}
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="Password"
					id="password"
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<button
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
					disabled={loading}
				>
					{loading ? "Loading..." : "Update"}
				</button>
			</form>
			<div className="flex justify-between mt-5">
				<span className="text-red-700 cursor-pointer">Delete Account</span>
				<span className="text-red-700 cursor-pointer">Sign Out</span>
			</div>
			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-700 mt-5">
				{updateSucces ? "User is updated successfully!" : ""}
			</p>
		</div>
	);
};

export default Profile;
