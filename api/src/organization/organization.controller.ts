import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/strategies/guards';
import { OrganizationService } from './organization.service';
import { Request } from 'express';
import { OrganizationModel, PriorityChangeDto, StatusChangeDto, TicketDetailModel, TicketModel, UserModel } from 'src/models/user.model';
import { User } from 'src/decorators/user.decorator';
import NylasClient from 'nylas';
import { TicketService } from './ticket.service';

@Controller('org')
export class OrganizationController {
    private readonly logger = new Logger(OrganizationController.name);
    constructor(private readonly orgService: OrganizationService, private readonly ticketService: TicketService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    public async createorg(@Req() req: Request, @User() user: UserModel): Promise<OrganizationModel> {
        const org = await this.orgService.create(req.body.name, user.userId);
        return { name: org.name, id: org.id };



    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    public async getOrg(@User() user: UserModel): Promise<OrganizationModel | null> {
        const org = await this.orgService.getOrg(user.userId);
        if (!org) {
            return null;
        }
        this.logger.log(`got org ${org} for user ${user.userId}`);
        return { name: org.name, id: org.id, oauth_token_email: org.oauthToken?.email };
    }

    @UseGuards(JwtAuthGuard)
    @Get('tickets')
    public async getTickets(@User() user: UserModel) {
        return this.ticketService.getTickets(user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('tickets/:id')
    public async getTicket(@User() user: UserModel, @Param('id') id: number): Promise<TicketDetailModel> {
        //TODO: check if user is allowed to access this ticket
        const threadsResponse = this.ticketService.getThreads(id);
        const ticketResponse = this.ticketService.getTicket(id);
        const [threads, ticket] = await Promise.all([threadsResponse, ticketResponse]);
        return {
            messages: threads,
            ticket: ticket
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('tickets/status')
    public async setTicketStatus(@Body() updateDto: StatusChangeDto): Promise<TicketModel> {
        return this.ticketService.setTicketStatus(updateDto.ticketId, updateDto.status);
    }

    @UseGuards(JwtAuthGuard)
    @Post('tickets/priority')
    public async setTicketPriority(@Body() updateDto: PriorityChangeDto): Promise<TicketModel> {
        return this.ticketService.setTicketPriority(updateDto.ticketId, updateDto.priority);
    }


}
