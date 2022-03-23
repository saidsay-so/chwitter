import React, { useState } from "react";
import "./UserProfile.css";
import Avatar from "../components/Avatar";
import SimpleButton from "../components/SimpleButton";
import { useParams } from "react-router-dom";

import { getUser as fetchUserInfo } from "../services/user";
import { useAuth } from "../providers/AuthProvider";
import { addFriend, areFriends, removeFriend } from "../services/friend";
import { getMessages as fetchMessages } from "../services/message";
import { useAsyncEffect } from "../utils/extra-hooks";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isFriend, setIsFriend] = useState(false);

  const { id } = useParams();
  const {
    user: { id: mainUid },
  } = useAuth();
  const isHimself = id === mainUid;

  const [isLoading, setIsLoading] = useState(true);

  const label = isFriend ? "➖ Supprimer des amis" : "➕ Ajouter aux amis";

  useAsyncEffect(async (stillMounted) => {
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
  }, []);

  const friendAction = (isFriend ? addFriend : removeFriend).bind(
    null,
    mainUid,
    id
  );

  if (isLoading) return <h1>Veuillez attendre...</h1>;

  return (
    <div className="user-profile">
      <aside className="info">
        <Avatar {...user} />
        <Link to={user.profileLink}>{user.name}</Link>
        <p>{user.description}</p>
        {isHimself && <SimpleButton onClick={friendAction} label={label} />}
      </aside>
      <section>
        <nav className="profile-nav">
          <NavLink to="messages">Messages</NavLink>
          <NavLink to="friends">Friends</NavLink>
        </nav>
        <div className="content">
          <Outlet context={{ isFriend, isHimself, friendAction }} />
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
