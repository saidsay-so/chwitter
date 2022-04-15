import React, { useState } from "react";
import "./UserProfile.css";
import { useParams } from "react-router-dom";

import { getUser as fetchUserInfo } from "../services/user";
import { useAuth } from "../providers/AuthProvider";
import { addFriend, removeFriend } from "../services/friend";
import { useAsyncEffect } from "../utils/extra-hooks";
import { AiFillMessage } from "react-icons/ai";
import { MdPeople } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import FriendButton from "../components/FriendButton";
import { User } from "../services/user";

export interface UserProfileOutletContext {
  uid: string;
  isFriend: boolean;
  isHimself: boolean;
  friendAction: (uid: User["id"]) => void;
  user: User;
}

const UserProfile = () => {
  const [user, setUser] = useState<User>({} as User);

  const id = useParams().id!;
  const { id: mainUid } = useAuth().user!;
  const isHimself = id === mainUid;

  const [isLoading, setIsLoading] = useState(false);

  useAsyncEffect(
    async (stillMounted) => {
      setIsLoading(true);

      const user = await fetchUserInfo(id);

      if (stillMounted()) {
        setUser(user);
        setIsLoading(false);
      }
    },
    [id]
  );

  const friendAction = (user.isFriend ? removeFriend : addFriend).bind(
    null,
    id
  );

  const outlet: UserProfileOutletContext = {
    uid: id,
    isFriend: user.isFriend,
    isHimself,
    friendAction,
    user,
  };

  if (isLoading) return <h1>Veuillez attendre...</h1>;

  return (
    <div className="user-profile">
      <div className="responsive-container">
        <article className="user-info">
          <div className="user-name-avatar">
            <div className="profile-avatar">
              <img src={user.avatarLink} alt={user.name} />
            </div>
            <div>
              <h3 className="user-name">{user.name}</h3>
              <h4 className="user-pseudo">@{user.name}</h4>
            </div>
          </div>
          <p className="description">{user.description}</p>
        </article>

        <div>
          {!isHimself && (
            <FriendButton
              onClick={() => friendAction()}
              isFriend={user.isFriend}
            />
          )}
        </div>

        <nav className="profile-nav">
          <NavLink className="profile-link" to="messages">
            <AiFillMessage /> Messages
          </NavLink>
          <NavLink className="profile-link" to="friends">
            <MdPeople /> Amis
          </NavLink>
        </nav>

        <section className="content">
          <Outlet context={outlet} />
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
