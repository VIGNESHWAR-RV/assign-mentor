import express from "express";
import { ObjectId } from "mongodb";
import { client } from "../index.js";
const route = express.Router();

route.get("/",async(request,response)=>{
   
    const students = await client.db("mentor_and_student")
                                 .collection("students")
                                 .find({})
                                 .toArray();
   
    response.send(students);
})

route.get("/:_id",async(request,response)=>{

    const id = request.params._id;

    const student = await client.db("mentor_and_student")
                               .collection("students")
                               .findOne({_id:ObjectId(id)});

    response.send(student);
})

route.post("/:_id",async(request,response)=>{

    const student_Id = request.params._id;

    const mentor_Id = request.body.mentor;

   
        const already_Assigned = await   client.db("mentor_and_student")
                                            .collection("mentors")
                                            .findOne({students:student_Id});
        let remove_Assigned = {};
        if(already_Assigned){

          remove_Assigned = await client.db("mentor_and_student")
                                        .collection("mentors")
                                        .updateOne({students:student_Id},
                                                   {$pull:{students:student_Id}});
         
        }
        if(mentor_Id==="none"){

            const student_Updation = await client.db("mentor_and_student")
                                                 .collection("students")
                                                 .updateOne({_id:ObjectId(student_Id)},
                                                           {$unset:{mentor:""}});

           return response.send({remove_Assigned,student_Updation});
        }

        const mentor_updation = await client.db("mentor_and_student")
                                            .collection("mentors")
                                            .updateOne({_id:ObjectId(mentor_Id)},
                                                       {$push:{students:student_Id}});

        const student_Updation = await client.db("mentor_and_student")
                                   .collection("students")
                                   .updateOne({_id:ObjectId(student_Id)},
                                             {$set:{mentor:mentor_Id}});
        
        
        
        return response.send({remove_Assigned,mentor_updation,student_Updation});

});


export const students_routes = route;



