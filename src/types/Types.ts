export type SelectedLetter = {
    letter: string | null,
    index: number
}

export type SelectedLetters = SelectedLetter[];

export type GuessedWord = {
    word: string,
    score: number
}

export type GuessedWords = GuessedWord[];