import { axiosInstance } from "@/lib/axios";

export const extractEmailContent = () => {
  // Select the email container (adjust the selector as needed)
  const emailContainer = document.querySelector(".gs");

  if (emailContainer) {
    // Extract sender details
    const senderElement = document.querySelector(".go"); // Adjust selector for sender
    const sender = senderElement
      ? senderElement.innerText.trim()
      : "Unknown Sender";

    // Extract subject
    const subjectElement = document.querySelector(".hP"); // Adjust selector for subject
    const subject = subjectElement
      ? subjectElement.innerText.trim()
      : "No Subject";

    // Extract email body
    const bodyElement = emailContainer.querySelector(".ii.gt"); // Adjust selector for body
    const body = bodyElement ? bodyElement.innerText.trim() : "No Body";

    // Extract footer (if any)
    const footerElement = emailContainer.querySelector(".gmail_extra"); // Adjust selector for footer
    const footer = footerElement ? footerElement.innerText.trim() : "No Footer";

    // Extract all hyperlinks from <a> tags
    const links = Array.from(emailContainer.querySelectorAll("a[href]")).map(
      (a) => ({
        text: a.innerText.trim(),
        href: a.href,
      })
    );

    // Extract hyperlinks from buttons (if they use onclick)
    const buttons = Array.from(emailContainer.querySelectorAll("button"));
    const buttonLinks = buttons
      .map((button) => {
        const onclick = button.getAttribute("onclick");
        if (onclick) {
          const match = onclick.match(
            /window\.location\.href=['"]([^'"]+)['"]/
          );
          if (match) {
            return {
              text: button.innerText.trim(),
              href: match[1],
            };
          }
        }
        return null;
      })
      .filter((link) => link !== null);

    // Combine all links
    const allLinks = [...links, ...buttonLinks];

    // Create JSON structure
    const emailData = {
      sender,
      subject,
      body,
      footer,
      links: allLinks,
    };

    // Log the JSON output
    console.log(JSON.stringify(emailData, null, 2));
    return emailData;
  } else {
    console.log("Email content not found.");
  }
};

export const getScannedReport = async (mailBody) => {
  try {
    mailBody = JSON.stringify(mailBody);
    console.log("Sending request with data:", mailBody); // Debug log

    // Make sure to await the response
    const response = await axiosInstance.post("/scan", mailBody);

    console.log("Received response:", response.data); // Debug log
    return response.data;
  } catch (err) {
    console.error("Scan error details:", {
      message: err.message,
      response: err.response,
      request: err.request,
    });

    // Throw a more informative error
    if (err.code === "ERR_NETWORK") {
      throw new Error(
        "Cannot connect to scanning service. Please check if the server is running on localhost:3001"
      );
    }

    throw new Error(err.response?.data?.error || err.message);
  }
};
