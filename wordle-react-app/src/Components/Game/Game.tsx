import { useEffect, useState } from "react";
import "./Game.css";
import Row from "./Row/Row";

const maxAttempts = 6;

async function pickNewWord(): Promise<string | void> {
	const newWordIndex = Math.floor(Math.random() * 14855);

	try {
		const resp = await fetch("src/assets/valid-wordle-words.txt");
		const data = await resp.text();
		const words = data.split("\n");
		return words[newWordIndex];
	} catch (err) {
		return console.log(err);
	}
}

export default function Game() {
	const [wordToGuess, setWordToGuess] = useState<string>("");
	const [prevGuessedWords, setPrevGuessedWords] = useState<string[]>([]);
	const [guessedWord, setGuessedWord] = useState<string>("");
	const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
	const [hasWon, setHasWon] = useState<boolean>(false);
	const [hasLost, setHasLost] = useState<boolean>(false);

	useEffect(() => {
		pickNewWord().then((word) => word && setWordToGuess(word));
	}, []);

	useEffect(() => {
		if (!hasWon && !hasLost) {
			const handleKeyPress = (letter: KeyboardEvent) => {
				if (letter.key == "Backspace") {
					handleGuessDeletion();
				}

				if (/^[a-zA-Z]$/.test(letter.key)) {
					handleSetGuessedWord(letter.key);
				}

				if (letter.key == "Enter") {
					handleGuessSubmition();
				}
			};

			// Attach the event listener when the component mounts
			document.addEventListener("keydown", handleKeyPress);

			// Clean up the event listener when the component unmounts
			return () => {
				document.removeEventListener("keydown", handleKeyPress);
			};
		}
	});

	function handleSetGuessedWord(letter: string): void {
		setGuessedWord((prevWord) => {
			if (prevWord.length < wordToGuess.length) {
				return guessedWord + letter;
			}
			return prevWord;
		});
	}

	function handleGuessDeletion(): void {
		setGuessedWord((prevWord) => {
			return prevWord.substring(0, prevWord.length - 1);
		});
	}

	function handleGuessSubmition(): void {
		if (guessedWord.length === wordToGuess.length) {
			setCurrentRowIndex((prevIndex) => {
				return prevIndex + 1;
			});

			setPrevGuessedWords((prevWords) => {
				return [...prevWords, guessedWord];
			});

			setGuessedWord("");
		}

		if (guessedWord === wordToGuess) {
			handleWin();
		} else if (
			guessedWord !== wordToGuess &&
			prevGuessedWords.length + 1 === maxAttempts
		) {
			handleLoss();
		}
	}

	function handleWin(): void {
		setHasWon(true);
	}

	function handleLoss(): void {
		setHasLost(true);
	}

	function handlePlayAgain(): void {
		setPrevGuessedWords([]);
		setCurrentRowIndex(0);
		setHasLost(false);
		setHasWon(false);
		setGuessedWord("");
		pickNewWord().then((word) => word && setWordToGuess(word));
	}

	const rows = Array(maxAttempts)
		.fill(null)
		.map((_, rowIndex) =>
			rowIndex === currentRowIndex ? (
				<Row
					key={rowIndex}
					submitted={false}
					guessedWord={guessedWord}
					wordToGuess={wordToGuess}
					rowIndex={rowIndex}
				/>
			) : rowIndex < currentRowIndex ? (
				<Row
					key={rowIndex}
					submitted={true}
					guessedWord={prevGuessedWords[rowIndex]}
					wordToGuess={wordToGuess}
					rowIndex={-1}
				/>
			) : (
				<Row
					key={rowIndex}
					submitted={false}
					guessedWord={""}
					wordToGuess={wordToGuess}
					rowIndex={-1}
				/>
			)
		);

	return (
		<div className='main-game-container'>
			<div className='end-game-container'>
				{(hasWon || hasLost) && (
					<div className='end-game-container-text'>
						{hasWon && <p>Congrats, you win!</p>}
						{hasLost && <p>Oh no! You've lost.</p>}
						{hasWon && (
							<p>
								You guessed {wordToGuess.toLocaleUpperCase()} in{" "}
								{prevGuessedWords.length}{" "}
								{prevGuessedWords.length > 1 ? "tries" : "try"}!
							</p>
						)}{" "}
						{hasLost && (
							<p>
								You've failed to guess{" "}
								{wordToGuess.toLocaleUpperCase()} in{" "}
								{maxAttempts} tries!
							</p>
						)}
					</div>
				)}
			</div>

			<div className='rows'>{rows}</div>
			<div className='button-container'>
				{(hasLost || hasWon) && (
					<button
						className='playAgainButton'
						onClick={handlePlayAgain}
					>
						Play Again?
					</button>
				)}
			</div>
		</div>
	);
}
