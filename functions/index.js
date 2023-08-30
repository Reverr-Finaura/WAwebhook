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
  try {
    const data = req.body;
    // const URL = "https://whatsapp-api-alg6.onrender.com"; // Change this URL to the appropriate webhook URL
    if (data) {
      logger.log("Received request body:", data);
      logger.log("Payload:", data.jsonPayload)
      logger.log("Entry:", data?.entry)
      logger.log("Changes:", data?.entry[0]?.changes)
      const changes = data.entry[0]?.changes[0];
      logger.log("changes", changes);

      if (
        changes &&
        changes.field === "messages" &&
        changes.value.messages[0].type === "text"
      ) {
        const messageBody = changes.value.messages[0].text.body;
        logger.log("Received text message:", messageBody);

        const response = await axios.post("https://whatsapp-api-alg6.onrender.com/api/webhook", {
          payload: data
        });

        logger.log("Webhook response:", response.data);
        res.sendStatus(200);
      } else {
        logger.log("No Text Data or Invalid Field");
        res.sendStatus(200);
      }
    } else {
      logger.log("No Valid Data");
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
