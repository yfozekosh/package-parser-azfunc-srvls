const {app, output} = require('@azure/functions');

const blobOutput = output.storageBlob({
    path: 'outs/{name}',
    connection: 'AzureWebJobsStorage',
})

app.storageBlob('transform-in-blob', {
    path: 'messages/{name}',
    connection: 'AzureWebJobsStorage',
    return: blobOutput,
    handler: (blob, context) => {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);

        // Convert blob to string, append text, and convert back to buffer
        const content = blob.toString();
        const modifiedContent = content + "appended";

        // Return the modified content to be saved to the output blob
        context.log(`Storage modified: ${modifiedContent}`);
        return Buffer.from(modifiedContent);
    }
});