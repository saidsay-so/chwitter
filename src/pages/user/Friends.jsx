import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import User from "../../components/User";
import { getFriends } from "../../services/friend";
import { useAsyncEffect } from "../../utils/extra-hooks";
import "./Friends.css";

const UserFriends = () => {
  const [friends, setFriends] = useState([]);
  const { id, isHimself, friendAction } = useOutletContext();

  useAsyncEffect(
    async (stillMounted) => {
      const rawFriends = await getFriends(id);

      if (stillMounted) {
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
            <User {...friend} action={friendAction} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFriends;
