import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CookieOptions, Response } from 'express'

export enum TokenType {
	ACCESS = 'access_token',
	REFRESH = 'refresh_token',
}

@Injectable()
export class TokensService {
	constructor(private jwtService: JwtService) {}

	generateTokens(payload: { _id: string; login: string; email: string }) {
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '2d',
		})

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	setRefreshTokenCookie(res: Response, tokenType: TokenType, token: string) {
		const day = tokenType === TokenType.ACCESS ? 2 : 7
		res.cookie(tokenType, token, {
			httpOnly: tokenType === TokenType.REFRESH,
			secure: true,
			sameSite: 'lax',
			maxAge: day * 24 * 60 * 60 * 1000,
		})
	}

	validateRefreshToken(token: string): any {
		try {
			const payload = this.jwtService.verify(token)
			return payload
		} catch (e) {
			throw new UnauthorizedException('Invalid token')
		}
	}

	removeTokens(res: Response) {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
		}

		res.clearCookie(TokenType.REFRESH, cookieOptions)
		res.clearCookie(TokenType.ACCESS, cookieOptions)
	}
}
