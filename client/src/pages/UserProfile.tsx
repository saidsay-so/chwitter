import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import { t, Plural, Trans } from "@lingui/macro";

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
  const [likedMsgCount, setLikedMsgCount] = useState<number | null>(null);

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

  const formattedMsgCount = msgCount === null ? 0 : msgCount;
  const formattedLikedMsgCount = likedMsgCount === null ? 0 : likedMsgCount;
  const formattedFriendsCount = friendsCount === null ? 0 : friendsCount;

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
                <AiFillMessage />{" "}
                <EmptyPlaceholderWrapper wraps={msgCount === null}>
                  <Plural
                    value={formattedMsgCount}
                    _0="Aucun message"
                    one="1 Message"
                    other={`${formattedMsgCount} Messages`}
                  ></Plural>
                </EmptyPlaceholderWrapper>
              </NavLink>
              <NavLink className="profile-link" to="friends">
                <MdPeople />{" "}
                <EmptyPlaceholderWrapper wraps={friendsCount === null}>
                  <Plural
                    value={formattedFriendsCount}
                    _0="Aucun ami ajouté"
                    one="1 Ami"
                    other={`${formattedFriendsCount} Amis`}
                  ></Plural>
                </EmptyPlaceholderWrapper>
              </NavLink>
              <NavLink className="profile-link" to="likedMessages">
                <BsHeartFill />{" "}
                <EmptyPlaceholderWrapper wraps={likedMsgCount === null}>
                  <Plural
                    value={formattedLikedMsgCount}
                    _0="Aucun like"
                    one="1 Like"
                    other={`${formattedLikedMsgCount} Likes`}
                  ></Plural>
                </EmptyPlaceholderWrapper>
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

const EmptyPlaceholderWrapper = ({
  wraps,
  children,
}: {
  children: React.ReactNode;
  wraps: boolean;
}) => {
  if (wraps) {
    return <div style={{ width: "2ch" }}> </div>;
  }

  return <>{children}</>;
};
