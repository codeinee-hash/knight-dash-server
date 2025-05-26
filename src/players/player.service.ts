import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreatePlayerDto } from './dto/create-player.dto'
import { Player, PlayerDocument } from './player.schema'

@Injectable()
export class PlayerService {
	constructor(
		@InjectModel(Player.name) private palyerModel: Model<PlayerDocument>
	) {}

	async createPlayer(dto: CreatePlayerDto) {
		const createdPlayer = new this.palyerModel(dto)
		const player = await createdPlayer.save()

		return {
			status: 'success',
			player,
		}
	}

	async getAllPlayers() {
		const players = await this.palyerModel.find().exec()

		return {
			status: 'success',
			data: players,
		}
	}

	async getPlayerByTel(telephone: string) {
		const player = await this.palyerModel.findOne({ telephone }).lean()

		return player
	}
}
