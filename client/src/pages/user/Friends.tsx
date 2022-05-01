import { useEffect, useReducer, useState, useTransition } from "react";
import { useOutletContext } from "react-router-dom";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { Severity } from "../../components/Toast";
import UserElement from "../../components/User";
import { useAuth } from "../../providers/AuthProvider";
import { useToast } from "../../providers/ToastProvider";
import { addFriend, getFriends, removeFriend } from "../../services/friend";
import { User } from "../../services/user";
import { useAsyncEffect } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Friends.css";

const enum FriendEventType {
  ADD,
  LOAD,
  REMOVE,
}

interface BaseFriendEvent {
  type: FriendEventType;
}

interface LoadFriendsEvent extends BaseFriendEvent {
  type: FriendEventType.LOAD;
  friends: User[];
}

interface RemoveFriendEvent extends BaseFriendEvent {
  type: FriendEventType.REMOVE;
  id: User["id"];
  index: number;
}

interface AddFriendEvent extends BaseFriendEvent {
  type: FriendEventType.ADD;
  id: User["id"];
  index: number;
}

type FriendEvent = LoadFriendsEvent | RemoveFriendEvent | AddFriendEvent;

export default function UserFriends() {
  const { id: mainUid } = useAuth().user!;
  const { uid, isHimself, setFriendsCount } =
    useOutletContext<UserProfileOutletContext>();
  const [isLoading, setisLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { report } = useToast();

  function reducer(users: User[], event: FriendEvent) {
    switch (event.type) {
      case FriendEventType.LOAD:
        return event.friends;
      case FriendEventType.REMOVE: {
        const { index } = event;

        const before = users.slice(0, index);
        const { isFriend, ...user } = users[index];
        const after = users.slice(index + 1);

        return isHimself
          ? [...before, ...after]
          : [...before, { ...user, isFriend: false }, ...after];
      }
      case FriendEventType.ADD: {
        const { index } = event;

        const before = users.slice(0, index);
        const { isFriend, ...user } = users[index];
        const after = users.slice(index + 1);

        return [...before, { ...user, isFriend: true }, ...after];
      }
    }
  }

  const [friends, dispatch] = useReducer(reducer, []);

  useAsyncEffect(
    async (stillMounted) => {
      setisLoading(true);
      const rawFriends = await getFriends(uid);

      if (stillMounted()) {
        startTransition(() => {
          dispatch({ type: FriendEventType.LOAD, friends: rawFriends });
          setisLoading(false);
        });
      }
    },
    [uid]
  );

  useEffect(() => {
    setFriendsCount(!isPending && !isLoading ? friends.length : null);
  }, [friends, uid]);

  const remove = (id: User["id"], index: number) => {
    removeFriend(id)
      .then(() => {
        dispatch({ type: FriendEventType.REMOVE, id, index });
      })
      .catch((error) => report({ severity: Severity.WARNING, error }));
  };

  const add = (id: User["id"], index: number) => {
    addFriend(id)
      .then(() => {
        dispatch({ type: FriendEventType.ADD, id, index });
      })
      .catch((error) => report({ severity: Severity.WARNING, error }));
  };

  return (
    <div className="friends-container">
      <ul className="friends">
        {isPending || isLoading ? (
          <LoadingPlaceholder />
        ) : friends.length > 0 ? (
          friends.map((friend, i) => (
            <li key={friend.id}>
              <UserElement
                {...friend}
                isFriend={
                  friend.id !== mainUid
                    ? isHimself || friend.isFriend
                    : undefined
                }
                friendAction={(friend.isFriend ? remove : add).bind(
                  null,
                  friend.id,
                  i
                )}
              />
            </li>
          ))
        ) : (
          <EmptyPlaceholder />
        )}
      </ul>
    </div>
  );
}
