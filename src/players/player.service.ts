import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
	SoloGame,
	SoloGameDocument,
} from 'src/solo-game/schemas/solo-game.schema'
import { CreatePlayerDto } from './dto/player.dto'
import { TopPlayer, TopPlayersByMode } from './types/player.interface'
import { Player, PlayerDocument } from './schemas/player.schema'

@Injectable()
export class PlayerService {
	constructor(
		@InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
		@InjectModel(SoloGame.name) private soloGameModel: Model<SoloGameDocument>
	) {}

	async createPlayer(dto: CreatePlayerDto) {
		const createdPlayer = new this.playerModel(dto)
		const player = await createdPlayer.save()

		return {
			status: 'success',
			player,
		}
	}

	async getAllPlayers() {
		const players = await this.playerModel.find().exec()

		return {
			status: 'success',
			data: players,
		}
	}

	async getPlayerByTel(telephone: string) {
		const player = await this.playerModel.findOne({ telephone }).lean()

		return player
	}

	async getPlayerByLogin(login: string) {
		const player = await this.playerModel.findOne({ login }).lean()

		return player
	}

	async getTopPlayers() {
		const timeModes = [15, 30, 60]
		const topPlayersByMode: TopPlayersByMode[] = []

		for (const timeMode of timeModes) {
			const topPlayers = await this.soloGameModel
				.aggregate<TopPlayer>([
					{ $match: { timeMode } },
					{
						$group: {
							_id: '$playerId',
							totalScore: { $max: '$totalScore' },
						},
					},
					{
						$lookup: {
							from: 'players',
							localField: '_id',
							foreignField: '_id',
							as: 'player',
						},
					},
					{ $unwind: '$player' },
					{ $sort: { totalScore: -1 } },
					{ $limit: 10 },
					{
						$project: {
							_id: '$player._id',
							login: '$player.login',
							telephone: '$player.telephone',
							totalScore: 1,
							timeMode: { $literal: timeMode },
						},
					},
				])
				.exec()

			topPlayersByMode.push({
				timeMode,
				players: topPlayers,
			})
		}

		return {
			status: 'success',
			data: topPlayersByMode,
		}
	}
}
