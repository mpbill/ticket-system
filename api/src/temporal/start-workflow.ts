import { Client, Connection, WorkflowClient } from '@temporalio/client';
import { emailProcessingWorkflow } from './workflow';

async function run() {
    const connection = await Connection.connect({ address: `${process.env.TEMPORAL_HOST || 'localhost'}:7233` });
    const client = new Client({ connection: connection });
    const handle = await client.workflow.start(emailProcessingWorkflow, {
        taskQueue: 'email-task-queue',
        workflowId: `email-processing-${Date.now()}`,
        cronSchedule: '*/15 * * * *',
    });

    console.log(`Started workflow with workflowId=${handle.workflowId}`);
    await handle.result();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});