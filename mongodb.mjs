import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://dbuser:dbpassword@cluster0.dgj52nu.mongodb.net/?retryWrites=true&w=majority";

export const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1);
    }
}
run().catch(console.dir);

process.on("SIGINT", async () => {
    console.log("app is terminating");
    await client.close();
    process.exit(0); // bcuz there is no any error
});