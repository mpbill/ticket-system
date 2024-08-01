import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entity/organization.entity';
import { User } from 'src/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Ticket } from 'src/entity/ticket.entity';
import { Email } from 'src/entity/email.entity';
import { TicketService } from './ticket.service';
@Module({
  imports: [TypeOrmModule.forFeature([Organization]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Ticket]), TypeOrmModule.forFeature([Email]), PassportModule],
  providers: [OrganizationService, TicketService],
  controllers: [OrganizationController]
})
export class OrganizationModule { }
