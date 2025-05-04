const {app} = require('@azure/functions');
const {BlobServiceClient} = require('@azure/storage-blob');

app.http('http-to-blob-via-sdk', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const name = req.query.name;
        if (!name) {
            context.res = {status: 400, body: "Please pass a name on the query string"};
            return;
        }

        const AZURE_STORAGE_CONNECTION_STRING = process.env.AzureWebJobsStorage;
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('messages');
        await containerClient.createIfNotExists();

        const blockBlobClient = containerClient.getBlockBlobClient(name);
        await blockBlobClient.upload(name, Buffer.byteLength(name));

        context.res = {body: `Blob '${name}' created.`};
    }
});