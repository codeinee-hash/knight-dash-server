import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNumber, IsString, Length } from 'class-validator'

export class CreatePlayerDto {
	@ApiProperty({ example: 'RenamedUser', description: 'Nick name' })
	@IsString({ message: 'Должно быть строкой' })
	readonly login: string

	@ApiProperty({ example: '+996500101112', description: 'Phone number' })
	@IsString({ message: 'Должно быть строкой' })
	@Length(13, 13, {
		message: 'Не меньше и не больше 13 символов (+996XXXXXXXXX)',
	})
	readonly telephone: string
}

export class UpdateScoreDto {
	@ApiProperty({ example: '6650b0c8123abc...', description: 'ID игрока' })
	@IsMongoId()
	readonly id: string

	@ApiProperty({ example: 2200, description: 'Очки игрока' })
	@IsNumber()
	readonly score: number
}

export class TopPlayerDto {
	@ApiProperty({
		example: '682a5b0c5498de8f2335788c',
		description: 'Уникальный идентификатор игрока',
	})
	_id: string

	@ApiProperty({
		example: 'Grizzzly',
		description: 'Логин игрока',
	})
	login: string

	@ApiProperty({
		example: '+996220001120',
		description: 'Телефон игрока',
	})
	telephone: string

	@ApiProperty({
		example: 1000,
		description: 'Максимальный счёт игрока в данном режиме',
	})
	totalScore: number

	@ApiProperty({
		example: 15,
		description: 'Режим игры (15, 30 или 60 секунд)',
	})
	timeMode: number
}

export class TopPlayersByModeDto {
	@ApiProperty({
		example: 15,
		description: 'Режим игры (15, 30 или 60 секунд)',
	})
	timeMode: number

	@ApiProperty({
		type: () => [TopPlayerDto],
		description: 'Список топ-10 игроков для данного режима',
	})
	players: TopPlayerDto[]
}

export class GetTopPlayersSuccessResponseDto {
	@ApiProperty({
		example: 'success',
		description: 'Статус ответа',
	})
	status: 'success'

	@ApiProperty({
		type: () => [TopPlayersByModeDto],
		description: 'Список топов игроков по режимам',
	})
	data: TopPlayersByModeDto[]
}
