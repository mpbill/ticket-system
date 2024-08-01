export class UserModel {
    email: string;
    name: string;
    userId: number;
}

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export class LoginDto {
    email: string;
    password: string;
}

export interface OrganizationModel {
    id: number;
    name: string;
    oauth_token_email?: string;

}

export interface TicketModel {
    id: number;
    status: string;
    priority: number;
    threadId: string;
    title: string;
}

export interface Message {
    id: number;
    subject?: string;
    sender?: string;
    body?: string;
    receivedDate: Date;
    threadId: string;
}

export interface TicketDetailModel {
    ticket: TicketModel
    messages: Message[];
}

export interface StatusChangeDto {
    status: string;
    ticketId: number;
}

export interface PriorityChangeDto {
    priority: number;
    ticketId: number;
}