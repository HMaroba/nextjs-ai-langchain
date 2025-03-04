// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { type NextRequest, NextResponse } from "next/server"
// import { OpenAI } from "openai"
// import { JSONLoader } from "langchain/document_loaders/fs/json";

// // Initialize OpenAI client with Google's API endpoint
// const openai = new OpenAI({
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
//   apiKey: process.env.API_KEY,
// })

// const loader = new JSONLoader(
//     "./states.json",
//     ["/state", "/code", "/nickname", "/website", "/admission_date", "/admission_number", "/capital_city", "/capital_url", "/population", "/population_rank", "/constitution_url", "/twitter_url"],
// );


// export async function POST(req: NextRequest) {
//   try {
//     // Extract messages from the request
//     const { messages } = await req.json()

//     // If no messages are provided or the array is empty, return an error
//     if (!messages || messages.length === 0) {
//       return NextResponse.json({ error: "No messages provided" }, { status: 400 })
//     }

//     // Load US states data
//     // const statesData = loadStatesData()
//     const statesData = await loader.load();

//     // Format the states data as a string for context
//     const statesContext = statesData
//       .map(
//         (state: any) =>
//           `State: ${state.state}, Code: ${state.code}, Nickname: ${state.nickname}, Capital: ${state.capital_city}, Population: ${state.population}, Admission Date: ${state.admission_date}`,
//       )
//       .join("\n")

//     // Get the last user message
//     const lastUserMessage = messages[messages.length - 1].content

//     // Create a system prompt that includes the states data
//     const systemPrompt = `You are a helpful assistant with knowledge about US states. 
// Answer the user's questions based only on the following context about US states. 
// If the answer is not in the context, reply politely that you do not have that information available:

// Context:
// ${statesContext}`

//     // Send a chat completion request to Google's Gemini model
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gemini-1.5-flash",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: lastUserMessage },
//       ],
//     })

//     // Extract the assistant's response
//     const assistantResponse = chatCompletion.choices[0].message

//     // Return the content in the format expected by the frontend
//     return NextResponse.json({ content: assistantResponse.content })
//   } catch (error) {
//     console.error("Error in chat API:", error)
//     return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
//   }
// }



// import { type NextRequest, NextResponse } from "next/server"
// import { OpenAI } from "openai"
// import { JSONLoader } from "langchain/document_loaders/fs/json"
// import path from "path"
// import fs from "fs"
// import { log } from "console"

// // Initialize OpenAI client with Google's API endpoint
// const openai = new OpenAI({
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
//   apiKey: process.env.API_KEY,
// })

// // Get the absolute path to the states.json file
// const statesFilePath = path.join(process.cwd(), "app/api/chat/states.json")

// export async function POST(req: NextRequest) {
//   try {
//     // Extract messages from the request
//     const { messages } = await req.json()

//     // If no messages are provided or the array is empty, return an error
//     if (!messages || messages.length === 0) {
//       return NextResponse.json({ error: "No messages provided" }, { status: 400 })
//     }

//     // Check if the file exists before trying to load it
//     if (!fs.existsSync(statesFilePath)) {
//       console.error(`File not found: ${statesFilePath}`)
//       return NextResponse.json({ error: "States data file not found" }, { status: 500 })
//     }

//     // Load US states data
//     const loader = new JSONLoader(
//       statesFilePath,
//       ["/state", "/code", "/nickname", "/website", "/admission_date", "/admission_number", "/capital_city", "/capital_url", "/population", "/population_rank", "/constitution_url", "/twitter_url"],
//     )
//     const statesData = await loader.load()

//     // Format the states data as a string for context
//     const statesContext = statesData
//       .map(
//         (state: any) =>
//           `State: ${state.state}, Code: ${state.code}, Nickname: ${state.nickname}, Capital: ${state.capital_city}, Population: ${state.population}, Admission Date: ${state.admission_date}`,
//       )
//       .join("\n")

//     // Get the last user message
//     const lastUserMessage = messages[messages.length - 1].content

//     // Create a system prompt that includes the states data
//     const systemPrompt = `You are a helpful assistant with knowledge about US states. 
// Answer the user's questions based only on the following context about US states. 
// If the answer is not in the context, reply politely that you do not have that information available:

// Context:
// ${statesContext}`

//     // Send a chat completion request to Google's Gemini model
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gemini-1.5-flash",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: lastUserMessage },
//       ],
//     })

//     // Extract the assistant's response
//     const assistantResponse = chatCompletion.choices[0].message

//     // Return the content in the format expected by the frontend
//     return NextResponse.json({ content: assistantResponse.content })
//   } catch (error) {
//     console.error("Error in chat API:", error)
//     return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"
import path from "path"
import fs from "fs"

// Initialize OpenAI client with Google's API endpoint
const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.API_KEY,
})

// Get the absolute path to the states.json file
const statesFilePath = path.join(process.cwd(), "app/api/chat/states.json")

export async function POST(req: NextRequest) {
  try {
    // Extract messages from the request
    const { messages } = await req.json()

    // If no messages are provided or the array is empty, return an error
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    // Check if the file exists before trying to load it
    if (!fs.existsSync(statesFilePath)) {
      console.error(`File not found: ${statesFilePath}`)
      return NextResponse.json({ error: "States data file not found" }, { status: 500 })
    }

    // Load US states data directly using fs instead of JSONLoader
    const statesRawData = fs.readFileSync(statesFilePath, "utf8")
    const statesData = JSON.parse(statesRawData)

    // Check if Alabama data exists
    const alabama = statesData.find((state: any) => state.state === "Alabama")
 

    // Format the states data as a string for context
    const statesContext = statesData
      .map(
        (state: any) =>
          `State: ${state.state}, Code: ${state.code}, Nickname: ${state.nickname}, Capital: ${state.capital_city}, Population: ${state.population}, Admission Date: ${state.admission_date}`,
      )
      .join("\n")

    // Log a sample of the context to verify formatting
    console.log("Context sample (first 500 chars):", statesContext.substring(0, 500))

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].content

    // Create a system prompt that includes the states data
    const systemPrompt = `You are a helpful assistant with knowledge about US states. 
Answer the user's questions based only on the following context about US states. 
If the answer is not in the context, reply politely that you do not have that information available.
Be sure to provide the exact data from the context when asked about specific information like population.

Context:
${statesContext}`

    // Send a chat completion request to Google's Gemini model
    const chatCompletion = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: lastUserMessage },
      ],
    })

    // Extract the assistant's response
    const assistantResponse = chatCompletion.choices[0].message

    // Return the content in the format expected by the frontend
    return NextResponse.json({ content: assistantResponse.content })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: `Failed to process the request: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

