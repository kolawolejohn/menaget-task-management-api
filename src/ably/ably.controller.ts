import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import * as Ably from 'ably';

@Controller('ably')
export class AblyController {
  private readonly ablyRest: Ably.Rest;

  constructor() {
    this.ablyRest = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  }

  @Get('token')
  async getToken() {
    try {
      const tokenRequest = await this.ablyRest.auth.createTokenRequest();
      return tokenRequest;
    } catch (err) {
      throw new HttpException(
        'Failed to generate token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
