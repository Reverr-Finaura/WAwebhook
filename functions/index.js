const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const { setGlobalOptions } = require("firebase-functions/v2");
const axios = require("axios");
// functions.runWith({
//   maxInstances: 5,
// })
setGlobalOptions({
  maxInstances: 5,
});
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/test", (req, res) => {
  res.json({
    message: "TESTINGG webhookkkk",
  });
});
app.get("/", (req, res) => {
  const verifyToken = "reverr_token";
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === verifyToken) {
    res.send(challenge);
  } else {
    res.sendStatus(403);
  }
});
app.post("/", async (req, res) => {
  const data = req.body;
  const URL = "https://server.reverr.io";
  logger.log("data", data);
  try {
    if (data) {
      logger.log(data);
      if (
        data.jsonPayload?.entry[0]?.changes[0]?.value.messages[0]?.type == "text"
      ) {
        const response = await axios.post(`${URL}/webhook`, {
          payload: data,
        });
        res.sendStatus(200);
      }else{
        res.sendStatus(200);
      }
      // res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

exports.webhook = onRequest(app);

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.json({
    message: "HIII",
  });
});
