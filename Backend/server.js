import express from "express";
import "dotenv/config";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";



//connect to mongo db

const app = express();
const PORT =8080;

app.use(express.json());//middle wares ---going to pass our incoming request
app.use(cors()); // used for frontend -backend communication

app.use("/api", chatRoutes); // any route starting with /chat will be handled by chatRoutes
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});

//function to connect to mongo db
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected with mongodb database");
    }catch(err){
        console.log("falied to connect with mongodb", err);
    }
}
// app.post("/test", async (req,res)=>{ // logic to test the API endpoint and OpenAI connection and send a sample request and get response and send it back to frontend and display it there
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`

//     },
//     body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [{role:"user", content:req.body.message}],
//     }),

// };
// try{
//     const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//     const data = await response.json();
//     console.log(data.choices[0].message.content);
//     res.send(data.choices[0].message.content);
// }catch(err){
//     console.log(err);

// }
// });
