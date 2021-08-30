import { View } from "@slack/bolt";

const getCreateGameView = (callback_id: string): View => ({
  callback_id,
  title: {
    type: "plain_text",
    text: "Set up your trivia game",
  },
  submit: {
    type: "plain_text",
    text: "Submit",
  },
  blocks: [
    {
      type: "input",
      block_id: "host_block",
      label: {
        type: "plain_text",
        text: "Select a host",
      },
      element: {
        type: "users_select",
        placeholder: {
          type: "plain_text",
          text: "Select a user",
          emoji: true,
        },
        action_id: "host_input",
      },
    },
    {
      type: "input",
      block_id: "game_name_block",
      element: {
        type: "plain_text_input",
        action_id: "game_name_input",
      },
      label: {
        type: "plain_text",
        text: "Name the game",
      },
    },
    {
      type: "input",
      block_id: "players_block",
      element: {
        type: "multi_users_select",
        placeholder: {
          type: "plain_text",
          text: "Select users",
          emoji: true,
        },
        action_id: "players_input",
      },
      label: {
        type: "plain_text",
        text: "Select players",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "arrange_teams_block",
      element: {
        type: "radio_buttons",
        options: [
          {
            text: {
              type: "plain_text",
              text: "I will arrange the teams",
              emoji: true,
            },
            value: "manual",
          },
          {
            text: {
              type: "plain_text",
              text: "Arrange the teams for me",
              emoji: true,
            },
            value: "auto",
          },
        ],
        action_id: "arrange_teams_input",
      },
      label: {
        type: "plain_text",
        text: "Teams",
        emoji: true,
      },
    },
  ],
  type: "modal",
});

export default getCreateGameView;
