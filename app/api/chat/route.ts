/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "fs"
import { join } from "path"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Load the states data
const loadStatesData = () => {
  try {
    const filePath = join(process.cwd(), "src/data/states.json")
    const fileContents = readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error loading states data:", error)
    return []
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const statesData = loadStatesData()

    // Format the states data as a string for context
    const statesContext = statesData
      .map(
        (state: any) =>
          `State: ${state.state}, Code: ${state.code}, Nickname: ${state.nickname}, Capital: ${state.capital_city}, Population: ${state.population}, Admission Date: ${state.admission_date}`,
      )
      .join("\n")

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      system: `Answer the user's questions based only on the following context about US states. If the answer is not in the context, reply politely that you do not have that information available:
      
      Context:
      ${statesContext}`,
      messages,
      temperature: 0,
    })

    return Response.json({ content: text })
  } catch (e) {
    console.error("Error in chat API:", e)
    return Response.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

