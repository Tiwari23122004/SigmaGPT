// import "dotenv/config";
// const getOpenAIAPIResponse = async (message) => {// logic to test the API endpoint and OpenAI connection and send a sample request and get response and send it back to frontend and display it there
//         const options = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{role:"user", content:message}],
//         }),
//     };
//     try{
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         console.log(data.choices[0].message.content);
//         return data.choices[0].message.content; // reply from fxn
//     }catch(err){
//         console.log(err);
    
//     }
// }
// export default getOpenAIAPIResponse;


import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return null;
  }
};

export default getOpenAIAPIResponse;
