import { Groq } from "groq-sdk";
import { config } from "dotenv";
import { systemPrompt } from "./systemPropmt.js";
config();

export class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async getScanedReport(mailBody) {
    try {
      const userContent =
        typeof mailBody === "string" ? mailBody : JSON.stringify(mailBody);
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        model: "qwen-2.5-32b",
        temperature: 0.6,
        max_completion_tokens: 4096,
        top_p: 0.95,
        stream: false,
        response_format: {
          type: "json_object",
        },
        stop: null,
      });

      return response.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.error("Error generating chat response:", error);
    }
  }
}
