import { ConnectionOptions } from 'typeorm';
import { Email } from 'src/entity/email.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { Ticket } from 'src/entity/ticket.entity';
import { Organization } from 'src/entity/organization.entity';
import { User } from 'src/entity/user.entity';

const ormConfig: PostgresConnectionOptions = {
    type: 'postgres',
    port: 5432,
    host: process.env.DB_HOST || 'localhost',
    password: 'password',
    username: 'postgres',
    database: 'platform',
    synchronize: true,
    dropSchema: false,
    entities: [Email, OAuthToken, Ticket, Organization, User],
};

export default ormConfig;