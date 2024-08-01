import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'Not Started' })
    status: string;

    @Column({ default: 1 })
    priority: number;


    @Column('varchar', { length: 1000, unique: true })
    threadId: string;

    @Column()
    title: string;

    @ManyToOne(() => Organization, org => org.tickets)
    org: Organization;
}