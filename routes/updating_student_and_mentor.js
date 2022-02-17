import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function updating_student_and_mentor(mentor_Id,students, pushing_or_pulling, setting_or_unsetting) {

    //checking whether students in list are already assigned to mentor
    const already_Assigned = await   client.db("mentor_and_student")
                                           .collection("mentors")
                                           .find({students:{$in:students}})
                                           .toArray();
    let remove_Assigned = {};

    if(already_Assigned){
            //removing if already present
              remove_Assigned = await client.db("mentor_and_student")
                                            .collection("mentors")
                                            .updateMany({students:{$in:students}},
                                                       {$pull:{students:{$in:students}}})
                                            
                              
    }


    let updation_In_Students;
     
    //updating the student list of mentor
    const updation_In_Mentor = await client.db("mentor_and_student")
                                           .collection("mentors")
                                           .updateOne({ _id: ObjectId(mentor_Id) },
                                               pushing_or_pulling);

    let student_ObjectIds = [];

    if (updation_In_Mentor) {

        for (let id of students) {
            student_ObjectIds.push(ObjectId(id));
        }

    }
  
    if (student_ObjectIds.length!==0) {

        //updating the students in the list with mentor Id
        updation_In_Students = await client.db("mentor_and_student")
                                           .collection("students")
                                           .updateMany({ _id: { $in: student_ObjectIds } },
                                               setting_or_unsetting);

    }

    if (updation_In_Mentor && updation_In_Students) {  //responding after successfull mentor and student updation
        return {remove_Assigned, updation_In_Mentor, updation_In_Students };
    }
    return "error"; //responding with error if something fails
}
