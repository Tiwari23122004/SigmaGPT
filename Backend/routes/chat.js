import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

//testing route
router.post("/test", async (req,res)=>{ // logic to test the API endpoint and OpenAI connection and send a sample request and get response and send it back to frontend and display it there
    try{
        const thread = new Thread({
            threadId: "threadxyz456",
            title: "Sample testing Thread2",
        });
        const response = await thread.save();
        res.send(response);

    }catch(err){
        console.log(err);
        res.status(500).json("failed to save in db");
    }
});

//get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ createdAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json("failed to fetch threads");
    }
});


router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            return res.status(404).json("thread not found");
        }
        res.json(thread);

    }catch(err){
        console.log(err);
        res.status(500).json("failed to fetch thread by id");
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try{
        const deletedthread = await Thread.findOneAndDelete({threadId});
        if(!deletedthread){
            return res.status(404).json("thread not found");
        }
        res.status(200).json({
            status: "success",
            message: "thread deleted successfully",
            threadId: deletedthread.threadId
        });


    }catch(err){
        console.log(err);
        res.status(500).json("failed to delete thread by id");
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

     if(!threadId || !message){// validating threadid and message---if exist or not in database
            return res.status(404).json({error:"missing required fields"});
        }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){// if thread does not exist
            //create new thread
            thread = new Thread({
                threadId,
                title: message.slice(0, 40),
                messages: [{role:"user", content:message}],
            });
        }else{//if thread already exists, just push new message
            thread.messages.push({role:"user", content:message});
        }
        //get response from openai api
        const assistantReply = await getOpenAIAPIResponse(message);

        if (!assistantReply) {
            return res.status(503).json({
                error: "AI service is not responding"
            });
        }

        thread.messages.push({role:"assistant", content:assistantReply});// push assistant reply to messages array
        thread.updatedAt = new Date();// update the updatedAt field
//save thread to db
        await thread.save();
        //send assistant reply to frontend
        res.json({reply: assistantReply});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
});

export default router;