import { decodeBase64 } from "../utils/utils";

export function mapDoubleAuthQuestion(doubleAuthQuestion) {
	const choices = doubleAuthQuestion.propositions.map((choice) => ({
		value: choice,
		display: decodeBase64(choice),
	}))
	return {
		question: doubleAuthQuestion.question,
		choices: choices
	};
}