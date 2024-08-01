import NylasClient, { Message } from 'nylas';
import { DatabaseClient } from './database'; // Your database client setup
import { Email as EmailEntity } from 'src/entity/email.entity';
import { Logger } from '@temporalio/worker';
import { Ticket } from 'src/entity/ticket.entity';
import { Organization } from 'src/entity/organization.entity';
import { OauthTokensService } from 'src/oauth-tokens/oauth-tokens.service';
const nylas = new NylasClient({ apiKey: process.env.NYLAS_API_KEY || '', apiUri: process.env.NYLAS_API_URL });


const db = new DatabaseClient(); // Your database client instance

interface EmailGroup {
    emails: EmailEntity[];
    org: Organization;
    processedFolderId: string
}

interface EmailUpdateItem {
    email: EmailEntity;
    processedFolderId: string;
    org: Organization;
}

function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchOrgs(): Promise<Organization[]> {
    try {
        await db.initializeDataSource();
        console.log('fetching orgs');
        const orgs = await db.getOrgs();
        console.log('fetched orgs ', orgs);
        return orgs;
    }
    finally {
        await db.closeConnection();
    }
}

export async function createOrFetchProcessedFolder(org: Organization): Promise<EmailGroup> {
    if (!org.oauthToken) {
        throw new Error('No token found for org');
    }
    try {
        await db.initializeDataSource();

        let processedFolderId: string | undefined = org.oauthToken.processedFolderId;
        if (!processedFolderId) {
            //potential bug if more than 20 folders/labels, implement pagination
            const folders = await nylas.folders.list({ identifier: org.oauthToken.grantId, queryParams: { limit: 20 } });
            let processedFolder = folders.data.find(f => f.name === 'Processed');
            if (!processedFolder) {
                const folderCreationResponse = await nylas.folders.create({ identifier: org.oauthToken.grantId, requestBody: { name: 'Processed' } });
                processedFolder = folderCreationResponse.data;
            }
            if (!processedFolder) {
                throw new Error('Processed folder not found or created');
            }
            processedFolderId = processedFolder.id;
            await db.saveOauthToken({ ...org.oauthToken, processedFolderId });
        }
        return { emails: [], org, processedFolderId };
    }
    finally {
        await db.closeConnection();
    }
}

export async function fetchEmails(data: EmailGroup): Promise<EmailGroup> {

    //implement pagination, should still work for low volume of emails per org
    const emails = await nylas.messages.list({ identifier: data.org.oauthToken.grantId, queryParams: { limit: 20, in: ['INBOX'] } });
    for (const email of emails.data) {
        data.emails.push(mapEmailToEmailEntities(email));

    }
    return data;


}

export async function saveEmails(data: EmailGroup): Promise<void> {
    try {
        await db.initializeDataSource();
        console.log('saving emails: ', data.emails.length);
        for (const email of data.emails) {

            await db.saveEmail(email);
            await db.saveTicket(mapEmailEntityToTicket(email, data.org));
            await nylas.messages.update({ identifier: data.org.oauthToken.grantId, messageId: email.emailId!, requestBody: { folders: [data.processedFolderId] } });
            await timeout(1000);
        }
    } finally {
        await db.closeConnection();
    }
}

function mapEmailToEmailEntities(message: Message): EmailEntity {
    let sender: string | undefined = undefined;
    if (message.from) {
        sender = message.from[0].email;
    }
    const emailEntity = new EmailEntity();
    emailEntity.body = message.body;
    emailEntity.subject = message.subject;
    emailEntity.receivedDate = new Date(message.date);
    emailEntity.sender = sender;
    emailEntity.emailId = message.id;
    emailEntity.threadId = message.threadId!;
    return emailEntity;
}

function mapEmailEntityToTicket(email: EmailEntity, org: Organization): Partial<Ticket> {
    return {
        org: org,
        status: 'Not Started',
        threadId: email.threadId,
        title: email.subject || 'No Title',
    }
}
