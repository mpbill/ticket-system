import { Injectable, Logger, Req, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Nylas, { URLForAuthenticationConfig, CodeExchangeRequest } from 'nylas'
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Organization } from 'src/entity/organization.entity';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/auth/user.service';
import { OrganizationService } from 'src/organization/organization.service';
import { Connection, WorkflowClient } from '@temporalio/client';
import { emailProcessingWorkflow } from 'src/temporal/workflow';

@Injectable()
export class TemporalService {
    private readonly temporalAddress: string;
    constructor(private configService: ConfigService, private readonly orgService: OrganizationService) {
        this.temporalAddress = `${process.env.TEMPORAL_HOST || 'localhost'}:7233`;
    }

    public async triggerWorkflow(): Promise<string> {
        const connection = await Connection.connect({ address: this.temporalAddress });
        const client = new WorkflowClient({ connection: connection });
        const handle = await client.start(emailProcessingWorkflow, {
            taskQueue: 'email-task-queue',
            workflowId: `email-processing-${Date.now()}`,
        });
        return handle.workflowId;
    }
}
