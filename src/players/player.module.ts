import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { PlayerController } from './player.controller'
import { Player, PlayerSchema } from './player.schema'
import { PlayerService } from './player.service'
import { ScoreController } from './score.controller'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
		forwardRef(() => AuthModule),
	],
	controllers: [PlayerController, ScoreController],
	providers: [PlayerService],
	exports: [PlayerService],
})
export class PlayerModule {}
