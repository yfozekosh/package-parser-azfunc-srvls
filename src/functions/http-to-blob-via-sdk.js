const {app} = require('@azure/functions');
const {BlobServiceClient} = require('@azure/storage-blob');

app.http('http-to-blob-via-sdk', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Request body: ${JSON.stringify(request)}`);
        const name = request.query.get("name");
        if (!name) {
            return {status: 400, body: "Please pass a name on the query string"};
        }

        const AZURE_STORAGE_CONNECTION_STRING = process.env["AzureWebJobsStorage"];
        context.log("AZ env = "+AZURE_STORAGE_CONNECTION_STRING);
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('messages');
        await containerClient.createIfNotExists();

        const blockBlobClient = containerClient.getBlockBlobClient(name);
        await blockBlobClient.upload(name, Buffer.byteLength(name));

        context.log("returning");
        return {status: 200, body: `Blob '${name}' created.`};
    }
});