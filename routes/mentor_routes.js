import express from "express";
import { ObjectId } from "mongodb";
import { client } from "../index.js";
import { updating_student_and_mentor } from "./updating_student_and_mentor.js";
const route = express.Router();

  //route to get all mentors
route.get("/",async(request,response)=>{

    const mentors = await client.db("mentor_and_student")
                                .collection("mentors")
                                .find({})
                                .toArray();

    response.send(mentors);
})
   
//route to get specific mentor
route.get("/:_id",async(request,response)=>{

    
    const id = request.params._id;

    const mentor = await client.db("mentor_and_student")
                               .collection("mentors")
                               .findOne({_id:ObjectId(id)});

    response.send(mentor);
})

  /*
  In mentor section , multiple students can be added or removed..
  so getting the result of changes as (students.add && students.remove)..

  In UI only unAssigned students will be shown as option to add students using getiing_students route
  but here we can also get the assigned students , uassign them and assign to new mentor
  */
route.post("/:_id",async(request,response)=>{

    const mentor_Id = request.params._id;  //getting mentor's Id from param

    const students_Ids = request.body; //getting student's added and removed info from body
    
    let updating_mentor_and_student = {}; //empty object to collect updated information

    if(students_Ids.add){  //condition to add students id if added

        let pushing_or_pulling = {$push:{students:{$each:students_Ids.add}}};
        let setting_or_unsetting = {$set:{mentor:mentor_Id}};

        updating_mentor_and_student.added =  await updating_student_and_mentor(mentor_Id,students_Ids.add, pushing_or_pulling, setting_or_unsetting);
    }

    if(students_Ids.remove){ //condition to remove students id if removed

        let pushing_or_pulling = {$pull:{students:{$in:students_Ids.remove}}};
        let setting_or_unsetting = {$unset:{mentor:""}};

        updating_mentor_and_student.removed = await updating_student_and_mentor(mentor_Id,students_Ids.remove, pushing_or_pulling, setting_or_unsetting);
    }
   
    if(updating_mentor_and_student.added === "error" ||   // condition to check if there is an error while updating
       updating_mentor_and_student.removed === "error"){

         return  response.status(500).send("dataBase not responding");
       }
  
    if(updating_mentor_and_student.added || updating_mentor_and_student.removed){ //condition to check whether its updated and response with updation info

      return response.send(updating_mentor_and_student);

    }

   return response.send("no updation"); //responding when there no change is made
});

export const mentor_routes = route;



