import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { SoloGame, SoloGameSchema } from 'src/solo-game/solo-game.schema'
import { PlayerController } from './player.controller'
import { Player, PlayerSchema } from './player.schema'
import { PlayerService } from './player.service'
import { ScoreController } from './score.controller'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
		MongooseModule.forFeature([
			{ name: SoloGame.name, schema: SoloGameSchema },
		]),
		forwardRef(() => AuthModule),
	],
	controllers: [PlayerController, ScoreController],
	providers: [PlayerService],
	exports: [PlayerService],
})
export class PlayerModule {}
