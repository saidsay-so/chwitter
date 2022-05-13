import { useEffect, useReducer } from "react";
import { useOutletContext } from "react-router-dom";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { Severity } from "../../components/Toast";
import UserElement from "../../components/User";
import { useAuth } from "../../providers/AuthProvider";
import { useToast } from "../../providers/ToastProvider";
import { addFriend, getFriends, removeFriend } from "../../services/friend";
import { User } from "../../services/user";
import { ServiceStatus, useService } from "../../utils/extra-hooks";
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

  const { status } = useService(
    getFriends.bind(null, uid),
    (friends) => dispatch({ type: FriendEventType.LOAD, friends }),
    [uid]
  );

  useEffect(() => {
    setFriendsCount(status === ServiceStatus.LOADING ? null : friends.length);
  }, [friends, uid]);

  const remove = (id: User["id"], index: number) => {
    const controller = new AbortController();
    removeFriend(id, controller.signal)
      .then(() => dispatch({ type: FriendEventType.REMOVE, id, index }))
      .catch((error) => report({ severity: Severity.ERROR, error }));
  };

  const add = (id: User["id"], index: number) => {
    const controller = new AbortController();
    addFriend(id, controller.signal)
      .then(() => dispatch({ type: FriendEventType.ADD, id, index }))
      .catch((error) => report({ severity: Severity.ERROR, error }));
  };

  return (
    <div className="friends-container">
      <ul className="friends">
        {status === ServiceStatus.LOADING ? (
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
