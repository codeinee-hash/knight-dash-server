import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SoloGame, SoloGameDocument } from 'src/solo-game/solo-game.schema'
import { CreatePlayerDto } from './dto/player.dto'
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

	async getTopPlayers() {
		const topPlayers = await this.playerModel.find()

		return topPlayers
	}
}
