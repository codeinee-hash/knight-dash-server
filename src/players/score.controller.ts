import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UpdateScoreDto } from './dto/player.dto'
import { PlayerService } from './player.service'

@ApiTags('Score')
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class ScoreController {
	constructor(private readonly playerService: PlayerService) {}

	@ApiOperation({ summary: 'Update player points and get top' })
	@ApiResponse({ status: 200, description: 'Successfully updated' })
	@Post('/score/update-score')
	async updateScore(@Body() dto: UpdateScoreDto, @Query('mode') mode: string) {
		const numericMode = Number(mode)
		if (
			!dto.id ||
			typeof dto.score !== 'number' ||
			![15, 30, 60].includes(numericMode)
		) {
			throw new BadRequestException('Некорректные данные')
		}

		const data = await this.playerService.updateScore(
			dto.id,
			dto.score,
			numericMode
		)

		return {
			status: 'success',
			message: 'Результат сохранён',
			data,
		}
	}

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
