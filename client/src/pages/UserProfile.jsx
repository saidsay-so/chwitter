import React, { useState } from "react";
import "./UserProfile.css";
import { useParams } from "react-router-dom";

import { getUser as fetchUserInfo } from "../services/user";
import { useAuth } from "../providers/AuthProvider";
import { addFriend, areFriends, removeFriend } from "../services/friend";
import { useAsyncEffect } from "../utils/extra-hooks";
import { AiFillMessage } from "react-icons/ai";
import { MdPeople } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import FriendButton from "../components/FriendButton";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isFriend, setIsFriend] = useState(false);

  const { id } = useParams();
  const {
    user: { id: mainUid },
  } = useAuth();
  const isHimself = id === mainUid;

  const [isLoading, setIsLoading] = useState(false);

  useAsyncEffect(
    async (stillMounted) => {
      setIsLoading(true);

      const isFriendPromise = isHimself
        ? Promise.resolve(false)
        : areFriends(id, mainUid);

      const [isFriend, user] = await Promise.all([
        isFriendPromise,
        fetchUserInfo(id),
      ]);

      if (stillMounted) {
        setIsFriend(isFriend);
        setUser(user);
        setIsLoading(false);
      }
    },
    [id]
  );

  const friendAction = (isFriend ? addFriend : removeFriend).bind(
    null,
    mainUid,
    id
  );

  if (isLoading) return <h1>Veuillez attendre...</h1>;

  return (
    <div className="user-profile">
      <div className="responsive-container">
        <article className="user-info">
          <div className="user-name-avatar">
            <div className="profile-avatar">
              <img src={user.picture} alt={user.name} />
            </div>
            <div>
              <h3 className="user-name" to={user.profileLink}>
                {user.name}
              </h3>
              <h4 className="user-pseudo" to={user.profileLink}>
                @{user.name}
              </h4>
            </div>
          </div>
          <p className="description">{user.description}</p>
        </article>

        <div>
          {!isHimself && (
            <FriendButton action={friendAction} isFriend={isFriend} />
          )}
        </div>

        <nav className="profile-nav">
          <NavLink className="profile-link" to="messages">
            <AiFillMessage /> {user.messagesCount} Messages
          </NavLink>
          <NavLink className="profile-link" to="friends">
            <MdPeople /> {user.friendsCount} Amis
          </NavLink>
        </nav>

        <section className="content">
          <Outlet context={{ id, isFriend, isHimself, friendAction, user }} />
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
