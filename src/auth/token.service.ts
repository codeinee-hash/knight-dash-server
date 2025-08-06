import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

@Injectable()
export class TokensService {
	constructor(private jwtService: JwtService) {}

	generateTokens(payload: { _id: string; login: string; telephone: string }) {
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '2d',
		})

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	setRefreshTokenCookie(res: Response, token: string) {
		res.cookie('refresh_token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
	}

	validateRefreshToken(token: string): any {
		try {
			const payload = this.jwtService.verify(token)
			console.log('Validated refresh token payload:', payload) // Логируем payload
			return payload
		} catch (e) {
			throw new UnauthorizedException('Invalid refresh token')
		}
	}
}
