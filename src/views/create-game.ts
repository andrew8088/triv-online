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
        action_id: "users_select-action",
      },
    },
    {
      type: "input",
      block_id: "game_name_input",
      element: {
        type: "plain_text_input",
        action_id: "sl_input",
      },
      label: {
        type: "plain_text",
        text: "Name the game",
      },
    },
    {
      type: "input",
      element: {
        type: "multi_users_select",
        placeholder: {
          type: "plain_text",
          text: "Select users",
          emoji: true,
        },
        action_id: "multi_users_select-action",
      },
      label: {
        type: "plain_text",
        text: "Select players",
        emoji: true,
      },
    },
    {
      type: "input",
      element: {
        type: "radio_buttons",
        options: [
          {
            text: {
              type: "plain_text",
              text: "I will arrange the teams",
              emoji: true,
            },
            value: "value-0",
          },
          {
            text: {
              type: "plain_text",
              text: "Arrange the teams for me",
              emoji: true,
            },
            value: "value-2",
          },
        ],
        action_id: "radio_buttons-action",
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
