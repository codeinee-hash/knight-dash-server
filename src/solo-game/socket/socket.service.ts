import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets'
import { Model } from 'mongoose'
import { SoloGame, SoloGameDocument } from '../solo-game.schema'
import { SoloGameService } from '../solo-game.service'

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class SoloGameSocketService implements OnGatewayConnection {
	constructor(
		@InjectModel(SoloGame.name) private soloGameModel: Model<SoloGameDocument>,
		private soloGameService: SoloGameService
	) {}

	handleConnection(client: any, ...args: any[]) {
		console.log('CONNECTED')
	}

	@SubscribeMessage('client-submit-score-path')
	async handleEvent(
		@MessageBody() { score, gameId }: { score: number; gameId: string },
		@ConnectedSocket() client: any
	) {
		console.log('dto from socket server: ', { score, gameId })

		try {
			const updatedSession = await this.soloGameService.submitScore({ score, gameId })
			client.emit('server-submit-score-path', updatedSession)
		} catch (error) {
			client.emit('server-error', {
				message: error.message,
				status: error.status || 500,
			})
		}
	}
}
