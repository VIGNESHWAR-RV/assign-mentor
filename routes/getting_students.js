import express from "express";
import { ObjectId } from "mongodb";
import { client } from "../index.js";
const route = express.Router();

route.get("/",async(request,response)=>{

    const mentor_Id = request.body.mentor; //getting mentor's Id from body

    let student_ObjectIds = [];

    if(mentor_Id !== "none"){ //checking if the mentor_id is not "none"

    const mentor = await client.db("mentor_and_student")
                               .collection("mentors")
                               .findOne({_id:ObjectId(mentor_Id)},
                                   {projection:{_id:0,students:1}})
                               
  
           if(mentor.students){
                //normal for looping style.. I like it though
                // for(let id of mentor.students){
                //     student_ObjectIds.push(ObjectId(id));
                // }

                 //doing the same loop with map 
                student_ObjectIds = mentor.students.map((id)=>ObjectId(id));
         
          }

    }

   const filter = (mentor_Id !== "none")   //filter condition to get filtered students
                       ?{_id:{$in:student_ObjectIds}}
                       :{mentor:null};
  
    const students = await client.db("mentor_and_student")
                                 .collection("students")
                                 .find(filter)
                                 .toArray();
                          
    response.send(students); //responding with the filtered students
  
  });

export const get_students = route;