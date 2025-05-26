import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type PlayerDocument = Player & Document

@Schema({ timestamps: true })
export class Player {
	@ApiProperty({ example: 'RenamedUser', description: 'Nick name' })
	@Prop({ required: true, unique: true })
	declare login: string

	@ApiProperty({ example: '+996500101112', description: 'Phone number' })
	@Prop({ required: true, unique: true, type: String })
	declare telephone: string

	@ApiProperty({ example: 1200, description: 'Scores for 15s' })
	@Prop({ type: Number })
	declare score15: number

	@ApiProperty({ example: 2200, description: 'Scores for 30s' })
	@Prop({ type: Number })
	declare score30: number

	@ApiProperty({ example: 4000, description: 'Scores for 60s' })
	@Prop({ type: Number })
	declare score60: number
}

export const PlayerSchema = SchemaFactory.createForClass(Player)
