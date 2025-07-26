import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { ValidationPipe } from './pipes/validation.pipe'

async function run() {
	const PORT = process.env.PORT || 8080
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: ['http://localhost:5173', 'https://knight-dash.vercel.app'],
		credentials: true,
	})
	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())

	const config = new DocumentBuilder()
		.setTitle('API Documentation Clone Miro')
		.setDescription('REST API Documentation')
		.setVersion('1.0.0')
		.addTag('@eldiyarchess')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/swagger-ui', app, document)

	await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`))
}

run()
