import axios from "axios";

export const scanURLPhishTank = (url) => {
  const encodedURL = encodeURI(url);

  axios
    .post("http://checkurl.phishtank.com/checkurl/", null, {
      params: {
        url: encodedURL,
        format: "json",
      },
    })
    .then((response) => {
      console.log("PhishTank response:", response.data);
    })
    .catch((error) => {
      console.error("Error checking URL:", error);
    });
};
