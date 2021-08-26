const { App } = require("@slack/bolt");

const PORT = process.env.PORT || 3000;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.message("hello", async ({ message, say }) => {
  await say(`hey there <@${message.user}`);
});

(async () => {
  await app.start(PORT);
  console.log(`triv.online is running on port ${PORT}`);
})();
