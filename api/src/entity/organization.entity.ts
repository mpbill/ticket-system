// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { OAuthToken } from './oauth_token.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => User, user => user.organization)
    users: User[];

    @OneToMany(() => Ticket, ticket => ticket.org)
    tickets: Ticket[];


    @OneToOne(() => OAuthToken, oauthToken => oauthToken.organization, { eager: true })
    oauthToken: OAuthToken;


}