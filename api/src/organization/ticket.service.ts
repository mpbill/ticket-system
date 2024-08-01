import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entity/organization.entity';
import { Ticket } from 'src/entity/ticket.entity';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { OrganizationService } from './organization.service';
import { Message, TicketModel } from 'src/models/user.model';
import { Email } from 'src/entity/email.entity';

@Injectable()
export class TicketService {
    constructor(@InjectRepository(Email) private emailRepo: Repository<Email>, @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>, private readonly orgService: OrganizationService) { }

    async getTickets(userId: number): Promise<TicketModel[]> {
        const org = await this.orgService.getOrg(userId);
        const tickets = await this.ticketRepository.findBy({ org: org });
        return tickets.map(this.mapTicketToModel);
    }

    async setTicketStatus(ticketId: number, status: string): Promise<TicketModel> {
        const ticket = await this.ticketRepository.findOneByOrFail({ id: ticketId });
        ticket.status = status;
        const updatedTicket = await this.ticketRepository.save(ticket);
        return this.mapTicketToModel(updatedTicket);
    }

    async setTicketPriority(ticketId: number, priority: number): Promise<TicketModel> {
        const ticket = await this.ticketRepository.findOneByOrFail({ id: ticketId });
        ticket.priority = priority;

        const tickets = await this.ticketRepository.save(ticket);
        return this.mapTicketToModel(tickets);
    }

    async getThreads(ticketId: number): Promise<Message[]> {
        const ticket = await this.ticketRepository.findOneByOrFail({ id: ticketId });
        const emails = await this.emailRepo.findBy({ threadId: ticket.threadId });
        return emails.map(this.mapEmailToMessage);
    }

    async getTicket(ticketId: number): Promise<TicketModel> {
        const ticket = await this.ticketRepository.findOneByOrFail({ id: ticketId });
        return this.mapTicketToModel(ticket);
    }

    private mapTicketToModel(ticket: Ticket): TicketModel {
        return {
            id: ticket.id,
            status: ticket.status,
            priority: ticket.priority,
            threadId: ticket.threadId,
            title: ticket.title,
        }
    }
    private mapEmailToMessage(email: Email): Message {
        return {
            id: email.id,
            threadId: email.threadId,
            sender: email.sender,
            subject: email.subject,
            body: email.body,
            receivedDate: email.receivedDate,
        }
    }
}

