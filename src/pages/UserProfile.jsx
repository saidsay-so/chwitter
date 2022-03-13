import React from "react";
import "./UserProfile.css";
import MessagesList from "../components/MessagesList";
import Avatar from "../components/Avatar";
import SimpleButton from "../components/SimpleButton";

const UserProfile = ({ messages, user, friendAction }) => {
    const label = user.isFriend ? "➖ Supprimer des amis" : "➕ Ajouter aux amis";

    return (
    <div className="user-profile">
        <aside className="info">
            <Avatar name={user.name}
                profileLink={user.profileLink}
                picture={user.picture} />
            <a href={user.profileLink}>{user.name}</a>
            <p>{user.description}</p>
            <SimpleButton onClick={friendAction} label={label} />
        </aside>
        <div className="messages-container">
            <h3>Messages</h3>
            <MessagesList
                messages={messages}
                friendAction={friendAction} />
        </div>
    </div>
    );
};

export default UserProfile;