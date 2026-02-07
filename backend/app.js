
import express from 'express';
import Task from "./models/Task.js";
import cors from 'cors';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
const app=express();

dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Keep the server attempting to connect for 5 seconds
    socketTimeoutMS: 45000,
})
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Connection error:", err));


app.use(cors());
app.use(express.json());

app.use(express.urlencoded());





 app.post("/api",async(req,res)=>{
  try{
   
    const task=req.body;
    
    if(!task){
      return res.status(400).json ({message:"Task is required"});
    }
     const newTask = new Task(task);
    const savedTask = await newTask.save();
    console.log(newTask);
    console.log("saved");

    res.status(201).json(savedTask); // 👈 send back to frontend
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
  
app.get("/api",async(req,res)=>{
  try{
    const tasks= await Task.find();
   
    res.json(tasks);
  }catch(err){
    console.log(err.message);
  }
});

app.delete("/api/:id",async(req,res)=>{
try{
  
  await Task.findByIdAndDelete(req.params.id);
  res.json({message: "Task Deleted"})

}catch(err){
 res.status(500).json({message: err.message});
}
})

app.put("/api/:id",async(req,res)=>{
try{
const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body,{
    new: true,  runValidators: true 
  });
   if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
   res.status(200).json(updatedTask);

}catch(err){
 res.status(500).json({message: err.message});
}
})


const PORT=3002;
app.listen( PORT, ()=>{
  console.log(`Serve running on address http://localhost:${PORT}`)

});


