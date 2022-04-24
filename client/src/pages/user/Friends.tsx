import { useState, useTransition } from "react";
import { useOutletContext } from "react-router-dom";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import UserElement from "../../components/User";
import { useAuth } from "../../providers/AuthProvider";
import { addFriend, getFriends, removeFriend } from "../../services/friend";
import { User } from "../../services/user";
import { useAsyncEffect } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Friends.css";

const UserFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const { id: mainUid } = useAuth().user!;
  const { uid, isHimself } = useOutletContext<UserProfileOutletContext>();
  const [isLoading, setisLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useAsyncEffect(
    async (stillMounted) => {
      setisLoading(true);
      const rawFriends = await getFriends(uid);
      setisLoading(false);

      if (stillMounted()) {
        startTransition(() => {
          setFriends(rawFriends);
        });
      }
    },
    [uid]
  );

  return (
    <div className="friends-container">
      <ul className="friends">
        {isPending || isLoading ? (
          <LoadingPlaceholder />
        ) : friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.id}>
              <UserElement
                {...friend}
                isFriend={
                  friend.id !== mainUid
                    ? isHimself || friend.isFriend
                    : undefined
                }
                friendAction={(friend.isFriend ? removeFriend : addFriend).bind(
                  null,
                  friend.id
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
};

export default UserFriends;
