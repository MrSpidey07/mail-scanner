import { GroqService } from "../services/groq.service.js";

const groqService = new GroqService();

export const getScannedReport = async (req, res, next) => {
  const mailBody = req.body;

  try {
    if (!mailBody) {
      throw new Error("Provide Mail Body");
    }

    const scannedMail = await groqService.getScanedReport(mailBody);

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
