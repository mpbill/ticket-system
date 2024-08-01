import { Worker, Logger, NativeConnection } from '@temporalio/worker';
import * as activities from './activities';

async function run() {

    const connection = await NativeConnection.connect({
        address: `${process.env.TEMPORAL_HOST || 'localhost'}:7233`,
    });

    const worker = await Worker.create({
        connection,
        workflowsPath: require.resolve('./workflow'),
        activities,
        debugMode: true,
        taskQueue: 'email-task-queue',
    });
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});