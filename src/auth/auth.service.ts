import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { firstValueFrom } from 'rxjs'
import { CreatePlayerDto } from 'src/players/dto/player.dto'
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
			_id: player?._id?.toString(),
			login: player.login,
			telephone: player.telephone,
		})

		this.tokensService.setRefreshTokenCookie(res, tokens.refreshToken)

		return {
			status: 'success',
			player: {
				_id: player?._id?.toString(),
				login: player.login,
				telephone: player.telephone,
			},
			access_token: tokens.accessToken,
		}
	}

	async registration(playerDto: CreatePlayerDto, res: Response) {
		const candidateByTel = await this.playerService.getPlayerByTel(
			playerDto.telephone
		)
		if (candidateByTel) {
			throw new HttpException(
				'Номер телефона уже занят',
				HttpStatus.BAD_REQUEST
			)
		}

		const candidateByLogin = await this.playerService.getPlayerByLogin(
			playerDto.login
		)
		if (candidateByLogin) {
			throw new HttpException('Имя уже занят', HttpStatus.BAD_REQUEST)
		}

		const player = await this.playerService.createPlayer(playerDto)

		const tokens = this.tokensService.generateTokens({
			_id: String(player.player?._id),
			login: player.player.login,
			telephone: player.player.telephone,
		})

		this.tokensService.setRefreshTokenCookie(res, tokens.refreshToken)

		try {
			const bitrixRes$ = this.httpService.post(
				`${process.env.BITRIX_URL}/rest/1/${process.env.BITRIX_API_KEY}/crm.lead.add.json`,
				new URLSearchParams({
					'fields[SOURCE_ID]': '127',
					'fields[NAME]': playerDto.login,
					'fields[TITLE]': 'GEEKS GAME: Хакатон 2025',
					'fields[PHONE][0][VALUE]': playerDto.telephone,
					'fields[PHONE][0][VALUE_TYPE]': 'WORK',
				}),
				{
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					timeout: 10000,
				}
			)

			const bitrixResponse = await firstValueFrom(bitrixRes$)
			const bitrixData = bitrixResponse.data

			return {
				status: 'success',
				message: 'Пользователь успешно зарегистрирован',
				player: {
					_id: player?.player?._id?.toString(),
					login: player.player.login,
					telephone: player.player.telephone,
				},
				access_token: tokens.accessToken,
				bitrix: bitrixData,
			}
		} catch (error) {
			console.error('Bitrix API error:', error.response?.data || error.message)

			return {
				status: 'success',
				message: 'Пользователь успешно зарегистрирован (Bitrix API error)',
				player: {
					_id: player?.player?._id?.toString(),
					login: player.player.login,
					telephone: player.player.telephone,
				},
				access_token: tokens.accessToken,
				bitrix: null,
			}
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
			_id: player?.id?.toString(),
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
				'Неверный логин или телефон',
				HttpStatus.BAD_REQUEST
			)
		}

		if (player.login !== playerDto.login) {
			throw new HttpException(
				'Неверный логин или телефон',
				HttpStatus.BAD_REQUEST
			)
		}

		return player
	}
}
