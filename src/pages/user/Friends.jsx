import { useState } from "react";
import { useParams } from "react-router-dom";
import User from "../../components/User";
import { getFriends } from "../../services/friend";
import { useAsyncEffect } from "../../utils/extra-hooks";
import "./Friends.css";

const UserFriends = () => {
  const [friends, setFriends] = useState([]);
  const { id } = useParams();

  useAsyncEffect(async (stillMounted) => {
    const friends = getFriends(id);

    if (stillMounted) {
      setFriends(friends);
    }
  }, []);

  return (
    <div className="friends-container">
      <ul className="friends">
        {friends.map((friend) => (
          <li key={friend.id}>
            <User {...friend} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFriends;
