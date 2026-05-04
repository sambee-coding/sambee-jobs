const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
require("dotenv").config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
// This line now reads your saved session from .env!
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

(async () => {
  console.log("Connecting...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  // This will now use the session to log in instantly
  await client.start({
    phoneNumber: async () => await input.text("Number: "),
    phoneCode: async () => await input.text("Code: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Bot is online and listening!");
 


  // --- THE LISTENER START ---
  // This function runs every single time ANY new message arrives
   client.addEventHandler(async (event) => {
    const message = event.message;
    // We convert the text to lowercase so it matches "Job", "JOB", or "job"
    const text = message.text ? message.text.toLowerCase() : "";
    
    // 1. Your target channel ID
    const targetChannel = "-1003726534387"; 

    // 2. The Filter Logic
    if (text.includes("internship") || text.includes("job") || text.includes("urgent")) {
      console.log(`🎯 MATCH FOUND! Filtering: "${message.text.substring(0, 20)}..."`);
      
      try {
        // This is the forwarding command
        await client.sendMessage(targetChannel, { message: message });
        console.log("✅ Successfully forwarded to category channel!");
      } catch (err) {
        console.log("❌ Error forwarding:", err.message);
      }
    }

  }, new NewMessage({}));

})();
//Chat ID: -1003726534387