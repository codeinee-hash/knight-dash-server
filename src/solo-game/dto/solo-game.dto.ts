import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { Request } from 'express'

export class CreateSoloGameDto {
	@ApiProperty({ example: 30, description: 'Time mode: 15 | 30 | 60' })
	@IsNumber()
	readonly timeMode: number
}

export interface RequestWithUser extends Request {
	user: { login: string; telephone: string, _id: string }
}
