import { Repository, DataSource } from 'typeorm';
import { Email } from 'src/entity/email.entity';
import { Organization } from 'src/entity/organization.entity';
import ormConfig from './ormconfig';
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { Ticket } from 'src/entity/ticket.entity';

export class DatabaseClient {
    private emailRepository: Repository<Email>;
    private orgRepository: Repository<Organization>;
    private oauthTokenRepository: Repository<OAuthToken>;
    private readonly ticketRepository: Repository<Ticket>;
    private readonly dataSource: DataSource;

    constructor() {
        this.dataSource = new DataSource(ormConfig);
        this.emailRepository = this.dataSource.getRepository(Email);
        this.orgRepository = this.dataSource.getRepository(Organization);
        this.oauthTokenRepository = this.dataSource.getRepository(OAuthToken);
        this.ticketRepository = this.dataSource.getRepository(Ticket);
    }

    async initializeDataSource() {
        await this.dataSource.initialize();
    }

    async saveEmail(emailData: Partial<Email>): Promise<Email> {
        const email = await this.emailRepository.findOneBy({ emailId: emailData.emailId });
        if (email) {
            console.log('email exists');
            return email;
        }
        return this.emailRepository.save(emailData);
    }

    async saveTicket(ticketData: Partial<Ticket>): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOneBy({ threadId: ticketData.threadId });
        if (ticket) {
            return ticket;
        }
        return this.ticketRepository.save(ticketData);
    }

    async getOrgs(): Promise<Organization[]> {
        const orgs = await this.orgRepository.find();
        return orgs;
    }

    async closeConnection() {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }

    async saveOauthToken(token: OAuthToken) {
        await this.oauthTokenRepository.save(token);
    }
}