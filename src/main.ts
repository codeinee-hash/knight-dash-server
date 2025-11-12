import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { ValidationPipe } from './pipes/validation.pipe'

async function run() {
	const PORT = process.env.PORT || 8080
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: [
			process.env.CLIENT_PROD_URL,
			process.env.CLIENT_STAGING_URL,
			process.env.CLIENT_DEV_URL,
		],
		credentials: true,
	})

	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())

	const config = new DocumentBuilder()
		.setTitle('Knihgt Dash API')
		.setVersion('1.0.2')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/swagger-ui', app, document)

	await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`))
}

run()
