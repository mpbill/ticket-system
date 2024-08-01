import { BadRequestException, Controller, Get, Query, Res, Req, HttpRedirectResponse, Redirect, Logger, ConsoleLogger, UseGuards } from '@nestjs/common';
import { NylasService } from './nylas.service';
import { OauthTokensService } from 'src/oauth-tokens/oauth-tokens.service';
import { Request } from 'express';
import { UserModel } from 'src/models/user.model';
import { User } from 'src/decorators/user.decorator';
import { OrganizationService } from 'src/organization/organization.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/strategies/guards';
import { TemporalService } from './temporal.service';
@Controller('nylas')
export class NylasController {
  private readonly logger = new Logger(NylasController.name)
  constructor(private readonly nylasService: NylasService, private oauthTokenService: OauthTokensService, private orgService: OrganizationService, private readonly temporalService: TemporalService) { }
  @Redirect()
  @UseGuards(JwtAuthGuard)
  @Get('auth')
  async getAuth(@Req() request: Request, @User() user: UserModel): Promise<HttpRedirectResponse> {
    const userOrg = await this.orgService.getOrg(user.userId)
    const response: HttpRedirectResponse = {
      statusCode: 302,
      url: this.nylasService.getAuthUrl(userOrg.id)
    }
    return response
  }
  @Redirect()
  @Get('oauth')
  async getOauthExchange(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('No Code Provided')
    }

    const token = await this.nylasService.exchangeCodeForToken(code, parseInt(state));
    // Process the token, e.g., save it to the database, start a session, etc.
    await this.oauthTokenService.addToken(token)
    await this.temporalService.triggerWorkflow();
    this.logger.log('successfully added token');
    const response: HttpRedirectResponse = {
      statusCode: 302,
      url: 'http://localhost:5173/org'
    }
    return response
  }

  @Get('trigger-workflow')
  public async triggerWorkflow(@User() user: UserModel): Promise<string> {
    const workflowId = await this.temporalService.triggerWorkflow();
    return workflowId;
  }




}
