import config from "./app/config";
import { MongoClient } from "mongodb";

let dbClient; 

export async function connectDB(){
    dbClient = new MongoClient(config.DB_URI as string);
    await dbClient.connect()
    console.log('Database sucessfully connected!')
}
export default dbClient