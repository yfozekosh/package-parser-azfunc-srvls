const { app } = require('@azure/functions');

app.storageBlob('transform-in-blob', {
    path: 'samples-workitems/{name}',
    connection: 'AzureWebJobsStorage',
    handler: (blob, context) => {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);
    }
});
