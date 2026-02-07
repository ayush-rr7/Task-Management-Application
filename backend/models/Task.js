
import mongoose from 'mongoose';

const taskSchema =  mongoose.Schema({
   
    Title: {
    type: String,
    // required: true,
  },
    Description: {
        type:String,
        required: true,
    }, 

    Status: {
        type:String
    },

  
});

 const Task= mongoose.model('Task', taskSchema)
export default Task;