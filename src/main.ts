import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { ValidationPipe } from './pipes/validation.pipe'

async function run() {
	const PORT = process.env.PORT || 8080
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: 'https://knight-dash.vercel.app',
		credentials: true,
	})

	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())

	const config = new DocumentBuilder()
		.setTitle('API Documentation Knihgt Dash')
		.setDescription('REST API Documentation')
		.setVersion('1.0.2')
		.addTag('@eldiyarchess')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/swagger-ui', app, document)

	await app.listen(PORT, '0.0.0.0', () => {
		console.log(`Server started on port - ${PORT}`)
		console.log(
			`Swagger UI available at http://localhost:${PORT}/api/swagger-ui/`
		)
	})
}

run()
