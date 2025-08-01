import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PlayerService } from './player.service'

@ApiTags('Players')
@Controller('api/v1')
export class PlayerController {
	constructor(private playerService: PlayerService) {}

	@ApiOperation({ summary: 'Get all players' })
	@ApiResponse({ status: 200, description: 'All players' })
	@UseGuards(JwtAuthGuard)
	@Get('/players')
	getAll() {
		return this.playerService.getAllPlayers()
	}
}
