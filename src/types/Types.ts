export type SelectedLetter = {
    letter: string | null,
    index: number
}

export type SelectedLetters = SelectedLetter[];

export type GuessedWord = {
    word: string,
    score: number,
    player_id?: string
}

export type GuessedWords = GuessedWord[];