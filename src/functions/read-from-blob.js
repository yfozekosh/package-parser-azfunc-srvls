const {app} = require('@azure/functions');
const {BlobServiceClient} = require('@azure/storage-blob');

app.http('read-from-blob', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const name = request.query.name;
        if (!name) {
            context.res = {status: 400, body: "Please pass a name on the query string"};
            return;
        }

        const AZURE_STORAGE_CONNECTION_STRING = process.env.AzureWebJobsStorage;
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('messages');

        const blockBlobClient = containerClient.getBlockBlobClient(name);
        try {
            const downloadBlockBlobResponse = await blockBlobClient.download(0);
            const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);
            context.res = {body: `Blob content: ${downloaded}`};
        } catch (error) {
            context.res = {status: 404, body: `Blob '${name}' not found.`};
        }
    }
});

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}