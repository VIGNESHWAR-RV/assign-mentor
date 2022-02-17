import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

import { mentor_routes } from "./routes/mentor_routes.js";
import { students_routes } from "./routes/students_routes.js";
import { get_students } from "./routes/getting_students.js";


dotenv.config();

const app = express();   //for express server
app.use(express.json()); //declared gloadbally to convert the data from JSON to native data-type and viceversa when received and sent
app.use(cors());  //cross-origin resource sharing to allow request from other domain

const port = process.env.PORT;       //env variables
const MONGO_URL = process.env.MONGO_URL;  //env vaiables

async function createConnection(){   
const client = new MongoClient(MONGO_URL);  //assigning our mongoDB database as client
await client.connect();   //connecting to our client
console.log("connected to MONGO-DB database");
return client;
}

export const client = await createConnection();


app.get("/",async(request,response)=>{     //to check whether the connection is working
    response.send("hiii I am back again");
})

app.use("/mentors",mentor_routes);   //express route for mentors

app.use("/students",students_routes);  //express route for students

app.use("/get_students",get_students);  //express route to get specific students(with mentor (or) un-assigned)

app.listen(port,console.log("server started"));  //setting express to listen to port




