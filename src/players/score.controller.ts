import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PlayerService } from './player.service'

@ApiTags('Score')
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class ScoreController {
	constructor(private readonly playerService: PlayerService) {}

	@ApiOperation({ summary: 'Get top players by mode' })
	@ApiResponse({ status: 200, description: 'Top players' })
	@Get('/score/top-players')
	async getTopPlayers() {
		const data = await this.playerService.getTopPlayers()

		return {
			status: 'success',
			data,
		}
	}
}
