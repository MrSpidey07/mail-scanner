import { Groq } from "groq-sdk";
import { config } from "dotenv";
import { systemPrompt } from "../utils/systemPropmt.js";
import axios from "axios";
import Database from "better-sqlite3";
import schedule from "node-schedule";

config();

export class PhishTankGroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.phishTankApiKey = process.env.PHISHTANK_API_KEY;
    this.dbPromise = this.initializeDatabase();
    this.startDatabaseUpdates();
  }

  async initializeDatabase() {
    const db = new Database("phishing_urls.db");

    db.exec(`
            CREATE TABLE IF NOT EXISTS phishing_urls (
                url TEXT PRIMARY KEY,
                verification_time TEXT,
                phish_detail_url TEXT,
                verified INTEGER
            )
        `);

    return db;
  }

  async updatePhishingDatabase() {
    try {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const maxRetries = 3;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          const response = await axios.get(
            `http://data.phishtank.com/data/online-valid.json`,
            {
              headers: {
                "User-Agent": "PhishTankScanner/1.0",
                Accept: "application/json",
              },
            }
          );

          const db = await this.dbPromise;

          const transaction = db.transaction(() => {
            db.prepare("DELETE FROM phishing_urls").run();
            const insert = db.prepare(
              "INSERT OR REPLACE INTO phishing_urls (url, verification_time, phish_detail_url, verified) VALUES (?, ?, ?, ?)"
            );

            for (const entry of response.data) {
              insert.run(
                entry.url,
                entry.verification_time,
                entry.phish_detail_url,
                entry.verified ? 1 : 0
              );
            }
          });

          transaction();
          console.log("PhishTank database updated successfully");
          break;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            retries++;
            if (retries < maxRetries) {
              console.log(
                `Rate limited. Waiting before retry ${retries}/${maxRetries}`
              );
              await delay(60 * 60 * 1000);
              continue;
            }
          }
          throw error;
        }
      }
    } catch (error) {
      console.error("Error updating PhishTank database:", error);
      if (error.response) {
        console.error("Error details:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
      }
    }
  }

  startDatabaseUpdates() {
    setTimeout(() => this.updatePhishingDatabase(), 5000);
    schedule.scheduleJob("0 2 * * *", () => {
      this.updatePhishingDatabase();
    });
  }

  async checkUrlInDatabase(url) {
    const db = await this.dbPromise;
    const result = db
      .prepare("SELECT * FROM phishing_urls WHERE url = ?")
      .get(url);
    return result !== undefined;
  }

  async extractUrls(mailBody) {
    const text =
      typeof mailBody === "string" ? mailBody : JSON.stringify(mailBody);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }

  async getScanedReport(mailBody) {
    try {
      if (!mailBody) {
        return "No content provided";
      }

      const urls = await this.extractUrls(mailBody);

      const urlChecks = await Promise.all(
        urls.map(async (url) => {
          const isPhishing = await this.checkUrlInDatabase(url);
          return { url, isPhishing };
        })
      );

      //console.log(urlChecks);
      const enhancedMailBody = {
        original_content: mailBody,
        url_analysis: urlChecks,
      };

      const userContent = JSON.stringify(enhancedMailBody);

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
      return JSON.stringify({
        error: "Failed to process content",
        details: error.message,
      });
    }
  }
}
