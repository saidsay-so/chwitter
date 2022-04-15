import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import UserElement from "../../components/User";
import { addFriend, getFriends, removeFriend } from "../../services/friend";
import { User } from "../../services/user";
import { useAsyncEffect } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Friends.css";

const UserFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const { uid, isHimself } = useOutletContext<UserProfileOutletContext>();

  useAsyncEffect(
    async (stillMounted) => {
      const rawFriends = await getFriends(uid);

      if (stillMounted()) {
        setFriends(rawFriends);
      }
    },
    [uid]
  );

  return (
    <div className="friends-container">
      <ul className="friends">
        {friends.map((friend) => (
          <li key={friend.id}>
            <UserElement
              {...friend}
              isFriend={isHimself || friend.isFriend}
              friendAction={(friend.isFriend ? removeFriend : addFriend).bind(
                null,
                friend.id
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFriends;
