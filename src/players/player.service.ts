import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SoloGame, SoloGameDocument } from 'src/solo-game/solo-game.schema'
import { CreatePlayerDto } from './dto/player.dto'
import { TopPlayer, TopPlayersByMode } from './interfaces/interfaces'
import { Player, PlayerDocument } from './player.schema'

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
					// Фильтруем по timeMode
					{ $match: { timeMode } },
					// Группируем по playerId, выбирая максимальный totalScore
					{
						$group: {
							_id: '$playerId',
							totalScore: { $max: '$totalScore' },
						},
					},
					// Объединяем с коллекцией Player, чтобы получить login и telephone
					{
						$lookup: {
							from: 'players',
							localField: '_id',
							foreignField: '_id',
							as: 'player',
						},
					},
					// Разворачиваем массив player
					{ $unwind: '$player' },
					// Сортируем по totalScore по убыванию
					{ $sort: { totalScore: -1 } },
					// Ограничиваем топ-10
					{ $limit: 10 },
					// Формируем выходные данные
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
