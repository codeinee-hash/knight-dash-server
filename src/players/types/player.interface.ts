export interface TopPlayer {
	_id: string
	login: string
	telephone: string
	totalScore: number
	timeMode: number
}

export interface TopPlayersByMode {
	timeMode: number
	players: TopPlayer[]
}
