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

export type ScoreRow = {
    nickname?: string,
    total_score?: number
}
export type ScoreList = ScoreRow[];

export type Player = {
    nickname?: string,
}

export type GameState = {
    game_id: string,
    shuffled_letters: string,
    started: string,
    ended?: string,
    player_1_id?: string,
    player_2_id?: string,
    player_1_nickname?: string,
    player_2_nickname?: string,
    type?: string,
    guessed_words?: GuessedWords,
    guessed_words_opponent?: GuessedWords,
    opponent_score_list?: ScoreList,
    player_1?: Player,
    player_2?: Player,
}