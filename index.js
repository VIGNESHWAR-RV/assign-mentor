import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { mentor_routes } from "./routes/mentor_routes.js";
import { students_routes } from "./routes/students_routes.js";
import { get_students } from "./routes/getting_students.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("connected to MONGO-DB database");
return client;
}

export const client = await createConnection();


app.get("/",async(request,response)=>{
    response.send("hiii I am back again");
})

app.use("/mentors",mentor_routes);

app.use("/students",students_routes);

app.use("/get_students",get_students);

app.listen(port,console.log("server started"));




