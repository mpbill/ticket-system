import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { fetchEmails, saveEmails, fetchOrgs, createOrFetchProcessedFolder } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

// Workflow function
export async function emailProcessingWorkflow(): Promise<void> {
    const orgs = await fetchOrgs();
    for (const org of orgs) {
        let group = await createOrFetchProcessedFolder(org);
        group = await fetchEmails(group);
        await saveEmails(group);
    }
}