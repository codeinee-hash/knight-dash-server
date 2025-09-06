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
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
		res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
		res.header('Access-Control-Allow-Credentials', 'true')
		if (req.method === 'OPTIONS') {
			return res.status(200).end()
		}
		next()
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

	await app.listen(PORT, () => {
		console.log(`Server started on port - ${PORT}`)
		console.log(
			`Swagger UI available at http://localhost:${PORT}/api/swagger-ui/`
		)
	})
}

run()