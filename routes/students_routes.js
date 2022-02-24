import express from "express";
import { ObjectId } from "mongodb";
import { client } from "../index.js";
const route = express.Router();

// to get all the students list
route.get("/",async(request,response)=>{
   
    const students = await client.db("mentor_and_student")
                                 .collection("students")
                                 .find({})
                                 .toArray();
   
    response.send(students);
})

// to get speciifc student
route.get("/:_id",async(request,response)=>{

    const id = request.params._id;

    const student = await client.db("mentor_and_student")
                               .collection("students")
                               .findOne({_id:ObjectId(id)});

    response.send(student);
})
  
// update the changes in mentorShip for particular student;
route.put("/:_id",async(request,response)=>{

    const student_Id = request.params._id;  //student id from params

    const mentor_Id = request.body.mentor;   //mentor id from body

   //checking student id , if he is already assigned
        // const already_Assigned = await   client.db("mentor_and_student")
        //                                     .collection("mentors")
        //                                     .findOne({students:student_Id});
        // let remove_Assigned = {};
        // if(already_Assigned){

            //removing student id , if he is already present
        let remove_Assigned = await client.db("mentor_and_student")
                                          .collection("mentors")
                                          .updateOne({students:student_Id},
                                                     {$pull:{students:student_Id}});
         
        // }
           //removing mentor details from specific student , if mentor_id is "none"
        if(mentor_Id==="none"){

            const student_Updation = await client.db("mentor_and_student")
                                                 .collection("students")
                                                 .updateOne({_id:ObjectId(student_Id)},
                                                           {$unset:{mentor:""}});
           
             //returning with the response of changes made in student
           return response.send({remove_Assigned,student_Updation});
        }

        //updating mentor list by adding the student id in students array of mentor
        const mentor_updation = await client.db("mentor_and_student")
                                            .collection("mentors")
                                            .updateOne({_id:ObjectId(mentor_Id)},
                                                       {$push:{students:student_Id}});

        //updating student details by adding mentor details in student
        const student_Updation = await client.db("mentor_and_student")
                                   .collection("students")
                                   .updateOne({_id:ObjectId(student_Id)},
                                             {$set:{mentor:mentor_Id}});
        
        
        //returning with response of the changes made
        return response.send({remove_Assigned,mentor_updation,student_Updation});

});


export const students_routes = route;



