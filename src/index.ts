import { App, LogLevel } from "@slack/bolt";
import { isGenericMessageEvent, isMissingUser } from "./utils/helpers";

import getCreateGameView from "./views/create-game";

const PORT: number = Number(process.env.PORT) || 3000;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

app.message("hello", async ({ message, say }) => {
  if (!isGenericMessageEvent(message) || isMissingUser(message)) return;
  await say(`hey there <@${message.user}>`);
});

app.command("/triv", async ({ ack, body, client }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: getCreateGameView("create-game-view1"),
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.view("create-game-view1", async ({ ack, body, view, client }) => {
  await ack();

  const user = body.user.id;
  const { host_block, game_name_block, players_block, arrange_teams_block } = view.state.values;

  const host = host_block.host_input.selected_user;
  const game = game_name_block.game_name_input.value;
  const players = players_block.players_input.selected_users || [];
  const arrangeTeams = arrange_teams_block.arrange_teams_input.selected_option?.value;

  console.log(
    JSON.stringify(
      {
        host,
        game,
        players,
        arrangeTeams,
      },
      null,
      "\t",
    ),
  );

  await client.chat.postMessage({
    channel: user,
    text: `Thanks! Starting "${game}" with ${players.map((p) => `<@${p}>`).join(", ")} (arrangement: ${arrangeTeams})`,
  });
});

(async () => {
  await app.start(PORT);
  console.log(`triv.online is running on port ${PORT}`);
})();
