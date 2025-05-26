import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { firstValueFrom } from 'rxjs'
import { CreatePlayerDto } from 'src/players/dto/create-player.dto'
import { PlayerService } from 'src/players/player.service'
import { TokensService } from './token.service'

@Injectable()
export class AuthService {
	constructor(
		private playerService: PlayerService,
		private tokensService: TokensService,
		private readonly httpService: HttpService
	) {}

	async login(playerDto: CreatePlayerDto, res: Response) {
		const player = await this.validatePlayer(playerDto)
		const tokens = this.tokensService.generateTokens({
			id: player.id,
			login: player.login,
			telephone: player.telephone,
		})

		this.tokensService.setRefreshTokenCookie(res, tokens.refreshToken)

		return {
			status: 'success',
			player,
			access_token: tokens.accessToken,
		}
	}

	async registration(playerDto: CreatePlayerDto, res: Response) {
		const candidate = await this.playerService.getPlayerByTel(
			playerDto.telephone
		)
		if (candidate) {
			throw new HttpException(
				'Номер телефона уже занят',
				HttpStatus.BAD_REQUEST
			)
		}

		const player = await this.playerService.createPlayer(playerDto)

		const tokens = this.tokensService.generateTokens({
			id: player.player.id,
			login: player.player.login,
			telephone: player.player.telephone,
		})

		this.tokensService.setRefreshTokenCookie(res, tokens.refreshToken)

		const bitrixRes$ = this.httpService.post(
			`${process.env.BITRIX_URL}`,
			new URLSearchParams({
				'fields[SOURCE_ID]': '127',
				'fields[NAME]': playerDto.login,
				'fields[TITLE]': 'GEEKS GAME: Хакатон 2025',
				'fields[PHONE][0][VALUE]': playerDto.telephone,
				'fields[PHONE][0][VALUE_TYPE]': 'WORK',
			}),
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			}
		)

		const bitrixResponse = await firstValueFrom(bitrixRes$)
		const bitrixData = bitrixResponse.data

		return {
			status: 'success',
			message: 'Пользователь успешно зарегистрирован',
			player,
			access_token: tokens.accessToken,
			bitrix: bitrixData,
		}
	}

	async logout(res: Response) {
		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
		})

		return {
			status: 'success',
			message: 'Logout successful',
		}
	}

	async refreshToken(req: Request, res: Response) {
		const refreshToken = req.cookies?.refresh_token
		if (!refreshToken) {
			throw new HttpException('Нет токена', HttpStatus.UNAUTHORIZED)
		}

		const payload = this.tokensService.validateRefreshToken(refreshToken)
		const player = await this.playerService.getPlayerByTel(payload.telephone)

		if (!player) {
			throw new HttpException('Игрок не найден', HttpStatus.UNAUTHORIZED)
		}

		const tokens = this.tokensService.generateTokens({
			id: player.id,
			login: player.login,
			telephone: player.telephone,
		})

		this.tokensService.setRefreshTokenCookie(res, tokens.refreshToken)

		return {
			status: 'success',
			access_token: tokens.accessToken,
		}
	}

	private async validatePlayer(playerDto: CreatePlayerDto) {
		const player = await this.playerService.getPlayerByTel(playerDto.telephone)

		if (!player) {
			throw new HttpException(
				'Неверный имя или телефон',
				HttpStatus.BAD_REQUEST
			)
		}

		if (player) {
			return player
		}

		throw new HttpException('Неверный имя или телефон', HttpStatus.BAD_REQUEST)
	}
}
