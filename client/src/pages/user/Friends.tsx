import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import UserElement from "../../components/User";
import { getFriends } from "../../services/friend";
import { User } from "../../services/user";
import { useAsyncEffect } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Friends.css";

const UserFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const { id, isHimself, friendAction } =
    useOutletContext<UserProfileOutletContext>();

  useAsyncEffect(
    async (stillMounted) => {
      const rawFriends = await getFriends(id);

      if (stillMounted()) {
        setFriends(rawFriends);
      }
    },
    [id]
  );

  return (
    <div className="friends-container">
      <ul className="friends">
        {friends.map((friend) => (
          <li key={friend.id}>
            <UserElement
              {...friend}
              isFriend={isHimself || friend.isFriend}
              friendAction={friendAction.bind(null, friend.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFriends;
