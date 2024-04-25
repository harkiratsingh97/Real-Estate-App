import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState("");
	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`);

				const data = await res.json();

				if (data.success === false) {
					console.log(data.message);
					return;
				}
				setUser(data);
			} catch (error) {
				console.log(error);
			}
		};
		getUser();
	}, [listing.userRef]);
	const onChange = (e) => {
		setMessage(e.target.value);
	};
	return (
		<>
			{user && (
				<div className="flex flex-col gap-2">
					<p>
						Contact <span className="font-semibold">{user.username}</span> for{" "}
						<span className="font-semibold">{listing.name.toLowerCase()}</span>
					</p>
					<textarea
						className="w-full border p-3 rounded-lg"
						name="message"
						id="message"
						rows="2"
						value={message}
						onChange={onChange}
						placeholder="Enter you message here..."
					></textarea>
					<Link
						className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
						to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}
					>
						Send Message
					</Link>
				</div>
			)}
		</>
	);
};

export default Contact;
