import React, { useEffect, useState } from "react";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
	const [files, setFiles] = useState([]);
	const [formData, setFormData] = useState({
		imageUrls: [],
		name: "",
		description: "",
		address: "",
		type: "rent",
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 50,
		discountPrice: 0,
		offer: false,
		parking: false,
		furnished: false,
	});
	const { id } = useParams();
	console.log(id);
	const [imageUploadEror, setImageUploadError] = useState(false);
	const [imageUploadLoading, setImageUploadLoading] = useState(false);

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { currentUser } = useSelector((state) => state.userReducer);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchListing = async () => {
			try {
				const res = await fetch(`/api/listing/get/${id}`);

				const data = await res.json();

				if (data.success === false) {
					console.log(data.message);
					return;
				}
				setFormData(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchListing();
	}, []);
	const handleImageSubmit = () => {
		setImageUploadLoading(true);
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setImageUploadLoading(true);
			const promises = [];
			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					});
					setImageUploadError(false);
					setImageUploadLoading(false);
				})
				.catch((err) => {
					setImageUploadError("Image upload failed (2mb per image)");
					setImageUploadLoading(false);
				});
		} else {
			setImageUploadError("You can add upto 6 images per listing");
			setImageUploadLoading(false);
		}
	};

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			try {
				const storage = getStorage(app);
				const fileName = new Date().getTime() + file.name;
				const storageRef = ref(storage, fileName);
				const uploadTask = uploadBytesResumable(storageRef, file);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					},
					(err) => {
						reject(err);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			} catch (err) {}
		});
	};

	const handleRemoveImage = (imageIndex) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((url, i) => i !== imageIndex),
		});
	};

	const handleChange = (e) => {
		if (e.target.id === "sell" || e.target.id === "rent") {
			setFormData({ ...formData, type: e.target.id });
		} else if (
			e.target.id === "parking" ||
			e.target.id === "furnished" ||
			e.target.id === "offer"
		) {
			setFormData({ ...formData, [e.target.id]: e.target.checked });
		} else setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (formData.imageUrls.length < 1)
				return setError("You must upload at least one Image");

			if (+formData.regularPrice < +formData.discountPrice)
				return setError("Discount price must be lower than regular pirce");
			setLoading(true);
			setError(false);
			const res = await fetch(`/api/listing/update/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...formData, userRef: currentUser._id }),
			});

			const data = await res.json();

			if (data.success === false) {
				setError(data.message);
				setLoading(false);
				return;
			}
			setLoading(false);
			navigate(`/listing/${data._id}`);
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};
	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">
				Update a Listing
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
				<div className="flex flex-col gap-4 flex-1">
					<input
						className="border p-3 rounded-lg "
						id="name"
						type="text"
						placeholder="Name"
						maxLength="62"
						minLength="10"
						required
						onChange={handleChange}
						value={formData.name}
					/>
					<textarea
						className="border p-3 rounded-lg "
						id="description"
						type="text"
						placeholder="Description"
						required
						onChange={handleChange}
						value={formData.description}
					/>
					<input
						className="border p-3 rounded-lg "
						id="address"
						type="text"
						placeholder="Address"
						required
						onChange={handleChange}
						value={formData.address}
					/>
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="sell"
								className="w-5"
								onChange={handleChange}
								checked={formData.type === "sell"}
							/>
							<span>Sell</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="rent"
								className="w-5"
								onChange={handleChange}
								checked={formData.type === "rent"}
							/>
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChange}
								checked={formData.parking === true}
							/>
							<span>Parking Spot</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								checked={formData.furnished === true}
								onChange={handleChange}
								className="w-5"
							/>
							<span>Furnished</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChange}
								checked={formData.offer === true}
							/>
							<span>Offer</span>
						</div>
					</div>

					<div className=" flex flex-wrap gap-6">
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
								onChange={handleChange}
								value={formData.bedrooms}
							/>
							<p>Beds</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
								onChange={handleChange}
								value={formData.bathrooms}
							/>
							<p>Baths</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="regularPrice"
								min="50"
								max="1000000"
								required
								className="p-3 border border-gray-300 rounded-lg"
								onChange={handleChange}
								value={formData.regularPrice}
							/>
							<div className="flex flex-col items-center">
								<p>Regular Price</p>
								<span className="text-sm">($/month)</span>
							</div>
						</div>

						{formData.offer && (
							<div className="flex items-center gap-2">
								<input
									type="number"
									id="discountPrice"
									min="0"
									max="1000000"
									required
									className="p-3 border border-gray-300 rounded-lg"
									onChange={handleChange}
									value={formData.discountPrice}
								/>
								<div className="flex flex-col items-center">
									<p>Discounted Price</p>
									<span className="text-sm">($/month)</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold ">
						Images:
						<span className="font-normal text-gray-600 ml-2">
							The first image will be the cover (max 6)
						</span>
					</p>
					<div className=" flex gap-4">
						<input
							className="p-3 border border-gray-300 rounded w-full"
							type="file"
							id="images"
							accept="image/*"
							multiple
							onChange={(e) => {
								setFiles(e.target.files);
							}}
						/>
						<button
							type="button"
							onClick={handleImageSubmit}
							className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
							disabled={imageUploadLoading}
						>
							{imageUploadLoading ? "Uploading..." : "Upload"}
						</button>
					</div>
					<p className="text-red-700 text-sm">
						{imageUploadEror && imageUploadEror}
					</p>
					{formData.imageUrls.length > 0 &&
						formData.imageUrls.map((url, index) => (
							<div className="flex justify-between p-3 border items-center ">
								<img
									key={index}
									src={url}
									alt="listing"
									className="w-20 h-20 object-contain rounded-lg"
								/>
								<button
									type="button"
									onClick={() => handleRemoveImage(index)}
									className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
								>
									Delete
								</button>
							</div>
						))}

					<button
						className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
						disabled={loading || imageUploadLoading}
					>
						{loading ? "Updating..." : "Update Listing"}
					</button>
					{error && <p className="text-red-700 text-sm">{error}</p>}
				</div>
			</form>
		</main>
	);
};

export default EditListing;
