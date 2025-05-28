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
