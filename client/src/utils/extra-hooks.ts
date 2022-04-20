import { CreateMessageParams } from "common";
import { useEffect, useReducer } from "react";
import { Severity } from "../components/Toast";
import { useToast } from "../providers/ToastProvider";
import { addFriend, removeFriend } from "../services/friend";
import {
  createMessage,
  deleteMessage,
  likeMessage,
  Message,
  unlikeMessage,
} from "../services/message";
import { User } from "../services/user";

export const useAsyncEffect = (
  asyncFn: (stillMounted: () => boolean) => Promise<void>,
  deps?: Parameters<typeof useEffect>["1"],
  destroy?: ReturnType<Parameters<typeof useEffect>["0"]>
) =>
  useEffect(() => {
    let stillMounted = true;

    asyncFn(() => stillMounted);

    return () => {
      stillMounted = false;

      if (destroy) destroy();
    };
  }, deps);

enum MessagesEventType {
  LOAD = "init",
  CREATE = "create",
  REMOVE_MSG = "removeMessage",
  LIKE = "like",
  UNLIKE = "unlike",
  ADD_FRIEND = "addFriend",
  REMOVE_FRIEND = "removeFriend",
}

interface BaseMessagesEvent {
  type: MessagesEventType;
}

interface InitEvent extends BaseMessagesEvent {
  type: MessagesEventType.LOAD;
  messages: Message[];
}

interface CreateMessageEvent extends BaseMessagesEvent {
  type: MessagesEventType.CREATE;
  message: Message;
}

interface RemoveMessageEvent extends BaseMessagesEvent {
  type: MessagesEventType.REMOVE_MSG;
  mid: Message["id"];
  index: number;
}

interface LikeEvent extends BaseMessagesEvent {
  type: MessagesEventType.LIKE;
  mid: Message["id"];
  index: number;
}
interface UnLikeEvent extends BaseMessagesEvent {
  type: MessagesEventType.UNLIKE;
  mid: Message["id"];
  index: number;
}
interface AddFriendEvent extends BaseMessagesEvent {
  type: MessagesEventType.ADD_FRIEND;
  uid: User["id"];
}
interface RemoveFriendEvent extends BaseMessagesEvent {
  type: MessagesEventType.REMOVE_FRIEND;
  uid: User["id"];
}

type MessagesEvent =
  | InitEvent
  | CreateMessageEvent
  | RemoveMessageEvent
  | LikeEvent
  | UnLikeEvent
  | AddFriendEvent
  | RemoveFriendEvent;

function reducer(messages: Message[], action: MessagesEvent) {
  switch (action.type) {
    case MessagesEventType.LOAD:
      return action.messages;

    case MessagesEventType.CREATE:
      return [action.message, ...messages];

    case MessagesEventType.REMOVE_MSG: {
      const { index } = action;
      return [...messages.slice(0, index), ...messages.slice(index + 1)];
    }

    case MessagesEventType.LIKE:
    case MessagesEventType.UNLIKE:
      const { index } = action;

      const [before, after] = [
        messages.slice(0, index),
        messages.slice(index + 1),
      ];

      const { isLiked, likes, ...msg } = messages[index];

      return [
        ...before,
        {
          ...msg,
          isLiked: !isLiked,
          likes: action.type === MessagesEventType.LIKE ? likes + 1 : likes - 1,
        },
        ...after,
      ];

    case MessagesEventType.ADD_FRIEND:
    case MessagesEventType.REMOVE_FRIEND:
      return messages.map(({ author: { isFriend, ...author }, ...msg }) => ({
        ...msg,
        author: { ...author, isFriend: !isFriend },
      }));
  }
}

export const useMessagesReducer = (): [
  Message[],
  {
    load: (messages: Message[]) => void;
    create: (message: CreateMessageParams) => void;
    like: (mid: string, index: number) => void;
    unlike: (mid: string, index: number) => void;
    removeMessage: (mid: string, index: number) => void;
    addFriend: (uid: string) => void;
    removeFriend: (uid: string) => void;
  }
] => {
  const [messages, dispatch] = useReducer(reducer, []);
  const { report } = useToast();

  return [
    messages,
    {
      load: (messages) => dispatch({ type: MessagesEventType.LOAD, messages }),
      create: (message) => {
        createMessage(message)
          .then((msg) =>
            dispatch({ type: MessagesEventType.CREATE, message: msg })
          )
          .catch((error) => report({ severity: Severity.ERROR, error }));
      },
      removeMessage: (mid, index) => {
        deleteMessage(mid)
          .then(() =>
            dispatch({ type: MessagesEventType.REMOVE_MSG, mid, index })
          )
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      like: (mid, index) => {
        likeMessage(mid)
          .then(() => dispatch({ type: MessagesEventType.LIKE, mid, index }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      unlike: (mid, index) => {
        unlikeMessage(mid)
          .then(() => dispatch({ type: MessagesEventType.UNLIKE, mid, index }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      addFriend: (uid) => {
        addFriend(uid)
          .then(() => dispatch({ type: MessagesEventType.ADD_FRIEND, uid }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      removeFriend: (uid) => {
        removeFriend(uid)
          .then(() => dispatch({ type: MessagesEventType.REMOVE_FRIEND, uid }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
    },
  ];
};
