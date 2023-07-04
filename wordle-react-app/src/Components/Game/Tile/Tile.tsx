import "./Tile.css";

export enum Status {
	Exact,
	Contains,
	NotIn,
}

interface ITileProp {
	letter: string;
	status: Status | null;
	submitted: boolean;
}

export default function Tile({ letter, status, submitted }: ITileProp) {
	return (
		<div
			className={`main-tile-container ${submitted && "submitted"} ${
				status === Status.Exact
					? `exact`
					: status === Status.Contains
					? `contains`
					: status === Status.NotIn
					? "notin"
					: ""
			} ${letter && "animated-element"}`}
		>
			{letter.toLocaleUpperCase()}
		</div>
	);
}
