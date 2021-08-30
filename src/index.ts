import { App, LogLevel } from "@slack/bolt";
import { isGenericMessageEvent, isMissingUser } from "./utils/helpers";

const PORT: number = Number(process.env.PORT) || 3000;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

app.message("hello", async ({ message, say }) => {
  console.log("got a message!", message);
  if (!isGenericMessageEvent(message) || isMissingUser(message)) return;

  await say(`hey there <@${message.user}>`);
});

(async () => {
  await app.start(PORT);
  console.log(`triv.online is running on port ${PORT}`);
})();
