import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { PlayerModule } from './players/player.module'

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
	],
})
export class AppModule {}
