import config from "./app/config";
import { Db, Document, MongoClient } from "mongodb";

let dbClient; 
let db: Db | null = null;

export async function connectDB(){
    dbClient = new MongoClient(config.DB_URI as string);
    await dbClient.connect()
    console.log("Database successfully connected!");
    db = dbClient.db()
    return dbClient.db();
}


export async function getDB(): Promise<Db> {
  if (!db) {
    return connectDB();
  }
  return db;
}
export function getCollection(name: string) {
    if(!db) throw new Error('Something went wrong!')
    return  db.collection(name);
}