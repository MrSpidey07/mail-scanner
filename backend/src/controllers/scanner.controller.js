import { PhishTankGroqService } from "../services/groq.service.js";
import { scanURLPhishTank } from "../services/phishTank.service.js";

const phishTankGroqService = new PhishTankGroqService();

export const getScannedReport = async (req, res) => {
  const mailBody = req.body;

  try {
    if (!mailBody) {
      throw new Error("Provide Mail Body");
    }

    const scannedMail = await phishTankGroqService.getScanedReport(mailBody);

    if (!scannedMail || scannedMail.length === 0) {
      throw new Error("No Report");
    }

    // Parse the string output into a JSON object
    let parsedReport;
    try {
      parsedReport = JSON.parse(scannedMail);
    } catch (parseError) {
      console.error("Error parsing scanned report:", parseError);
      throw new Error("Invalid JSON format in scanned report");
    }

    res.status(200).json(parsedReport);
  } catch (error) {
    console.log("Error in Scanner Controller", error);
    res.status(500).json({ error: error.message });
  }
};

export const getURLScan = async (req, res) => {
  const mailBody = req.body;

  try {
    if (!mailBody.links || !Array.isArray(mailBody.links)) {
      return res.status(400).json({ error: "No links provided." });
    }

    const scannedURLs = await Promise.all(
      mailBody.links
        .filter(
          (linkObj) =>
            linkObj.href &&
            (linkObj.href.startsWith("http://") ||
              linkObj.href.startsWith("https://"))
        )
        .map(async (linkObj) => {
          const result = await scanURLPhishTank(linkObj.href);
          console.log(result);
          return { url: linkObj.href, result };
        })
    );

    res.status(200).json({ scannedURLs });
  } catch (error) {
    res.status(500).json({ error: error.message } || "Internal Server Error");
    console.log("Error in Scanner Controller", error);
  }
};
