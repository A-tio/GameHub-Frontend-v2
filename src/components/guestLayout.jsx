import { Outlet } from "react-router-dom";

export default function GuestLayout() {
	return (
		<div className="main-box">
			<div className="name-box">
				{/* This is the Guest Layout */}
			</div>
			<Outlet />
		</div>
	);
}
