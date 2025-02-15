import { useState } from "react";
import { createRoot } from "react-dom/client";
import ScanButton from "@/content/ScanButton";
import ResultPopup from "@/content/ResultPopup";
import { extractEmailContent, getScannedReport } from "@/background";
import "@/content/ScanButton.css";

// Container component that manages both the scan button and the result popup
const ScannerContainer = () => {
  const [scanData, setScanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Extract email content from Gmail page
      const emailData = extractEmailContent();
      if (!emailData) {
        throw new Error("No email content found");
      }

      // Retrieve scan report based on the email content
      const result = await getScannedReport(emailData);
      console.log("Scan result:", result);
      setScanData(result);
    } catch (err) {
      setError(err.message);
      console.error("Scan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setScanData(null);
    setError(null);
  };

  return (
    <>
      <ScanButton onClick={handleScan} isLoading={isLoading} />
      {(scanData || error) && (
        <ResultPopup data={scanData} error={error} onClose={handleClose} />
      )}
    </>
  );
};

const injectScanner = () => {
  console.log("Attempting to inject scanner");
  const gmailContainer = document.querySelector(".nH.a98.iY");
  console.log("Gmail container found:", !!gmailContainer);

  if (gmailContainer) {
    const existingContainer = document.querySelector(
      ".email-scanner-container"
    );
    if (!existingContainer) {
      console.log("Creating new scanner container");
      const container = document.createElement("div");
      container.className = "email-scanner-container";
      gmailContainer.appendChild(container);

      try {
        const root = createRoot(container);
        root.render(<ScannerContainer />);
        console.log("Scanner rendered successfully");
      } catch (error) {
        console.error("Error rendering scanner:", error);
      }
    }
  }
};

const waitForGmail = () => {
  const interval = setInterval(() => {
    console.log("Checking for Gmail container...");
    const gmailContainer = document.querySelector(".nH.a98.iY");
    if (gmailContainer) {
      console.log("Gmail container found, injecting scanner");
      clearInterval(interval);
      injectScanner();
    }
  }, 1000);

  setTimeout(() => clearInterval(interval), 30000);
};

const init = () => {
  console.log("Initializing content script");
  waitForGmail();

  const observer = new MutationObserver(() => {
    const gmailContainer = document.querySelector(".nH.a98.iY");
    if (gmailContainer && !document.querySelector(".email-scanner-container")) {
      console.log("Gmail container found through observer");
      injectScanner();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

init();
