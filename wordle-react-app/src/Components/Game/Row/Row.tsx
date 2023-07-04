import Tile from "../Tile/Tile";
import "./Row.css";
import { Status } from "../Tile/Tile";

interface IRowProp {
	submitted: boolean;
	guessedWord: string;
	wordToGuess: string;
	rowIndex: number;
}

export default function Row({
	submitted,
	guessedWord,
	wordToGuess,
	rowIndex,
}: IRowProp) {
	var wordToGuessDict: any = {};
	var guessMadeDict: any = {};

	for (let i = 0; i < wordToGuess.length; i++) {
		var char = wordToGuess[i];
		wordToGuessDict[char] = (wordToGuessDict[char] || 0) + 1;
	}

	for (let i = 0; i < guessedWord.length; i++) {
		var char = guessedWord[i];
		guessMadeDict[char] = (guessMadeDict[char] || 0) + 1;
	}

	function handleStatusDetermination(tileIndex: number): Status | null {
		if (submitted) {
			if (guessedWord[tileIndex] === wordToGuess[tileIndex]) {
				guessMadeDict[guessedWord[tileIndex]]--;
				wordToGuessDict[guessedWord[tileIndex]]--;
				return Status.Exact;
			} else if (
				wordToGuess.includes(guessedWord[tileIndex]) &&
				wordToGuessDict[guessedWord[tileIndex]] >=
					guessMadeDict[guessedWord[tileIndex]]--
			) {
				return Status.Contains;
			}

			return Status.NotIn;
		}
		return null;
	}

	const rowTiles = Array(wordToGuess.length)
		.fill(null)
		.map((_, tileIndex) => (
			<Tile
				key={tileIndex + rowIndex * wordToGuess.length}
				letter={guessedWord[tileIndex] || ""}
				submitted={submitted}
				status={handleStatusDetermination(tileIndex)}
			/>
		));

	return <div className='main-row-container'>{rowTiles}</div>;
}
