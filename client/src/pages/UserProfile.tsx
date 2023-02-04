import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import { t, Trans } from "@lingui/macro";

import { getUser } from "../services/user";
import { useAuth } from "../providers/AuthProvider";
import { addFriend, removeFriend } from "../services/friend";
import { ServiceStatus, useService } from "../utils/extra-hooks";
import { AiFillMessage } from "react-icons/ai";
import { MdPeople } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import FriendButton from "../components/FriendButton";
import { User } from "../services/user";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import SimpleButton from "../components/SimpleButton";
import { BsHeartFill } from "react-icons/bs";

export interface UserProfileOutletContext {
  uid: string;
  isFriend: boolean;
  isHimself: boolean;
  setMsgCount: (c: number | null) => void;
  setLikedMsgCount: (c: number | null) => void;
  setFriendsCount: (c: number | null) => void;
  friendAction: () => void;
  user: User;
}

export default function UserProfile() {
  const [user, setUser] = useState<User>({} as User);
  const [msgCount, setMsgCount] = useState<number | null>(null);
  const [friendsCount, setFriendsCount] = useState<number | null>(null);
  const [likedmsgCount, setLikedMsgCount] = useState<number | null>(null);

  const id = useParams().id!;
  const { id: mainUid } = useAuth().user!;
  const isHimself = id === mainUid;

  const navigate = useNavigate();

  const { status } = useService(getUser.bind(null, id), setUser, [id]);

  useEffect(() => {
    setFriendsCount(null);
    setMsgCount(null);
    setLikedMsgCount(null);
  }, [id]);

  const friendAction = () => {
    const controller = new AbortController();
    setUser(({ isFriend, ...user }) => ({ ...user, isFriend: !isFriend }));
    (user.isFriend ? removeFriend : addFriend)(id, controller.signal);
  };

  const editProfile = () => {
    navigate("/edit");
  };

  const outlet: UserProfileOutletContext = {
    uid: id,
    isFriend: user.isFriend,
    isHimself,
    setMsgCount,
    setFriendsCount,
    setLikedMsgCount,
    friendAction,
    user,
  };

  const formattedMsgCount = msgCount === null ? "\u00A0" : msgCount;
  const formattedLikedMsgCount =
    likedmsgCount === null ? "\u00A0" : likedmsgCount;
  const formattedFriendsCount = friendsCount === null ? "\u00A0" : friendsCount;

  return (
    <div className="responsive-container">
      <div className="user-profile">
        {status === ServiceStatus.LOADING ? (
          <LoadingPlaceholder />
        ) : (
          <>
            <article className="user-info">
              <div className="user-name-avatar">
                <div className="profile-avatar">
                  <img src={user.avatarLink} alt={user.name} />
                </div>
                <div>
                  <h3 className="user-name">{user.displayName}</h3>
                  <h4 className="user-pseudo">@{user.name}</h4>
                </div>
              </div>
              <p className="description">{user.description}</p>
            </article>

            <div>
              {isHimself ? (
                <SimpleButton
                  label={t`Editer le profil`}
                  onClick={editProfile}
                />
              ) : (
                <FriendButton
                  onClick={() => friendAction()}
                  isFriend={user.isFriend}
                />
              )}
            </div>

            <nav className="profile-nav">
              <NavLink className="profile-link" to="messages">
                <AiFillMessage /> <Trans>{formattedMsgCount} Messages</Trans>
              </NavLink>
              <NavLink className="profile-link" to="friends">
                <MdPeople /> <Trans>{formattedFriendsCount} Amis</Trans>
              </NavLink>
              <NavLink className="profile-link" to="likedMessages">
                <BsHeartFill /> <Trans>{formattedLikedMsgCount} Likes</Trans>
              </NavLink>
            </nav>

            <section className="content">
              <Outlet context={outlet} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
