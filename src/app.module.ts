import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { PlayerModule } from './players/player.module'
import { SoloGameModule } from './solo-game/solo-game.module'

@Module({
	controllers: [],
	providers: [],
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		MongooseModule.forRoot(process.env.DATABASE_URL || ''),
		PlayerModule,
		AuthModule,
		SoloGameModule,
	],
})
export class AppModule {}
