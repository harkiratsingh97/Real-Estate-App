import { list } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
	FaBath,
	FaBed,
	FaChair,
	FaMapMarkerAlt,
	FaParking,
	FaShare,
} from "react-icons/fa";

const Listing = () => {
	SwiperCore.use(Navigation);
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	useEffect(() => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				setError(false);
				const res = await fetch(`/api/listing/get/${id}`);

				const data = await res.json();

				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				}
				setListing(data);
				setLoading(false);
			} catch (error) {
				setError(true);
			}
		};

		fetchListing();
	}, [id]);

	if (loading) {
		return <p className="text-center my-7 text-2xl">Loading...</p>;
	}

	if (error) {
		return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
	}
	return (
		<main>
			{listing && !loading && !error && (
				<>
					<Swiper navigation>
						{listing.imageUrls.map((listImg) => (
							<SwiperSlide key={listImg}>
								<div
									className="h-[480px]"
									style={{
										background: `url(${listImg}) center no-repeat`,
										backgroundSize: "cover",
									}}
								></div>
							</SwiperSlide>
						))}
					</Swiper>
					<div
						className="fixed top-[13%] right-[3%] z-10 border 
                    rounded-full w-12 h-12 flex justify-center 
                    items-center bg-slate-100 cursor-pointer"
					>
						<FaShare className="text-slate-500" />
					</div>
					<div className="flex flex-col max-w-4xl mx-auto p-3 gap-4 my-7">
						<p className="text-2xl font-semibold ">
							{listing.name} - ${" "}
							{listing.offer
								? listing.discountPrice.toLocaleString("en-US")
								: listing.regularPrice.toLocaleString("en-US")}
							{listing.type === "rent" && " / month"}
						</p>
						<p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
							<FaMapMarkerAlt className="text-green-700" />
							{listing.address}
						</p>
						<div className="flex gap-4">
							<p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
								{listing.type === "rent" ? "For Rent" : "For Sale"}
							</p>
							{listing.offer === true && (
								<p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
									{" "}
									${+listing.regularPrice - +listing.discountPrice}
								</p>
							)}
						</div>
						<p className="text-slate-800">
							<span className="font-semibold text-black"> Description -</span>{" "}
							{listing.description}
						</p>
						<ul className="text-green-900 font-semibold text-sm flex gap-4 items-center sm:gap-6 flex-wrap">
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaBed className="text-lg " />
								{listing.bedrooms > 1
									? `${listing.bedrooms} beds`
									: `${listing.bedrooms} bed`}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaBath className="text-lg" />
								{listing.bathrooms > 1
									? `${listing.bathrooms} baths`
									: `${listing.bathrooms} bath`}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaParking className="text-lg " />
								{listing.parking ? `Parking Spot` : `No Parking`}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaChair className="text-lg" />
                                {listing.furnished ? `Furnished` : `Not Furnished`}

							</li>
						</ul>
					</div>
				</>
			)}
		</main>
	);
};

export default Listing;
