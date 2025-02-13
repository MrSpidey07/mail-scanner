import React from "react";
import { createRoot } from "react-dom/client";
import ScanButton from "@/content/ScanButton";
import "@/content/ScanButton.css";

console.log("Content script loaded"); // Debug log

// Function to inject button
const injectButton = () => {
  console.log("Attempting to inject button"); // Debug log

  // Find Gmail's Div
  const gmailContainer = document.querySelector(".nH.a98.iY");
  console.log("Gmail container found:", !!gmailContainer); // Debug log

  if (gmailContainer) {
    // Check if our button already exists
    const existingButton = document.querySelector(".email-scanner-container");
    if (!existingButton) {
      console.log("Creating new button container"); // Debug log

      // Create container for our button
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "email-scanner-container";

      // Add button at the beginning of the container
      gmailContainer.appendChild(buttonContainer);

      try {
        // Create React root and render button
        const root = createRoot(buttonContainer);
        root.render(React.createElement(ScanButton));
        console.log("Button rendered successfully"); // Debug log
      } catch (error) {
        console.error("Error rendering button:", error); // Debug error
      }
    }
  }
};

// Function to wait for Gmail to load
const waitForGmail = () => {
  const interval = setInterval(() => {
    console.log("Checking for Gmail container..."); // Debug log
    const gmailContainer = document.querySelector(".nH.a98.iY");
    if (gmailContainer) {
      console.log("Gmail container found, injecting button"); // Debug log
      clearInterval(interval);
      injectButton();
    }
  }, 1000); // Check every second

  // Clear interval after 30 seconds to prevent infinite checking
  setTimeout(() => clearInterval(interval), 30000);
};

// Initialize content script
const init = () => {
  console.log("Initializing content script"); // Debug log
  waitForGmail();

  // Also observe DOM changes
  const observer = new MutationObserver(() => {
    const gmailContainer = document.querySelector(".nH.a98.iY");
    if (gmailContainer && !document.querySelector(".email-scanner-container")) {
      console.log("Gmail container found through observer"); // Debug log
      injectButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

// Start the content script
init();
