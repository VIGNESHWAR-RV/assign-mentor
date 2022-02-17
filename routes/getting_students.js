import express from "express";
import { ObjectId } from "mongodb";
import { client } from "../index.js";
const route = express.Router();

route.get("/",async(request,response)=>{

    const mentor_Id = request.body.mentor; //getting mentor's Id from body

    let student_ObjectIds = [];

    if(mentor_Id !== "none"){

    const mentor = await client.db("mentor_and_student")
                               .collection("mentors")
                               .findOne({_id:ObjectId(mentor_Id)},
                                   {projection:{_id:0,students:1}})
                               
  
           if(mentor.students){
         
                for(let id of mentor.students){
                    student_ObjectIds.push(ObjectId(id));
                }
         
          }
    }

   const filter = (mentor_Id !== "none")
                       ?{_id:{$in:student_ObjectIds}}
                       :{mentor:null};
  
    const students = await client.db("mentor_and_student")
                                 .collection("students")
                                 .find(filter)
                                 .toArray();
                          
    response.send(students);
  
  });

export const get_students = route;