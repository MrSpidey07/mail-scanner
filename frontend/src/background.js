export const extractEmailContent = () => {
  const gsDiv = document.querySelector(".gs");
  if (gsDiv) {
    console.log("Extracted Email Content:", gsDiv.innerText);
  } else {
    console.log("Email content not found.");
  }
};
