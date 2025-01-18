import { Link } from "react-router";
import AddTextDialog from "./AddTextDialog";

export default function Navbar() {
	return (
		<div className="flex items-center justify-between px-4 py-2 shadow-lg">
			<div className="text-lg font-bold">
				<Link to={"/"}>WSD</Link>
			</div>
			<AddTextDialog />
		</div>
	);
}
