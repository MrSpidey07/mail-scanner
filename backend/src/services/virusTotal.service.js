import axios from "axios";
import { config } from "dotenv";

export class VirusTotal {
  constructor(url) {
    config();
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", url);
  }

  async getURLID() {
    const options = {
      method: "POST",
      url: "https://www.virustotal.com/api/v3/urls",
      headers: {
        accept: "application/json",
        "x-apikey": process.env.VIRUS_TOTAL_KEY,
        "content-type": "application/x-www-form-urlencoded",
      },
      data: encodedParams,
    };

    return axios
      .request(options)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }

  async getURLReport(id) {
    const options = {
      method: "GET",
      url: "https://www.virustotal.com/api/v3/analyses/" + id,
      headers: {
        accept: "application/json",
        "x-apikey": process.env.VIRUS_TOTAL_KEY,
      },
    };

    return axios
      .request(options)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }
}
