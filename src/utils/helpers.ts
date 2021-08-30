import {
  GenericMessageEvent,
  MessageChangedEvent,
  MessageDeletedEvent,
  MessageEvent,
  MessageRepliedEvent,
  ReactionAddedEvent,
  ReactionMessageItem,
} from "@slack/bolt";

export const isGenericMessageEvent = (
  msg: MessageEvent
): msg is GenericMessageEvent => {
  return (msg as GenericMessageEvent).subtype === undefined;
};

export const isMessageItem = (
  item: ReactionAddedEvent["item"]
): item is ReactionMessageItem => {
  return (item as ReactionMessageItem).type === "message";
};

// Don't know the API well enough to know how to properly handle these
// message types
export const isMissingUser = (
  item: MessageEvent
): item is MessageChangedEvent | MessageDeletedEvent | MessageRepliedEvent => {
  return (
    !!item.subtype &&
    ["message_changed", "message_deleted", "message_replied"].includes(
      item.subtype
    )
  );
};
