import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { PlayerController } from './player.controller'
import { Player, PlayerSchema } from './player.schema'
import { PlayerService } from './player.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
		forwardRef(() => AuthModule),
	],
	controllers: [PlayerController],
	providers: [PlayerService],
	exports: [PlayerService],
})
export class PlayerModule {}
