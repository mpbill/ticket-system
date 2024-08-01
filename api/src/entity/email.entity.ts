import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class Email {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    emailId: string;

    @Column()
    subject?: string;

    @Column()
    sender?: string;

    @Column('text')
    body?: string;

    @Column()
    receivedDate: Date;

    @Column()
    threadId: string;
}