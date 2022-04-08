import PropTypes from "prop-types";
import "./NavigationPanel.css";
import "./NavigationPanelAction.css";
import { Link, NavLink, NavLinkProps } from "react-router-dom";
import { MdAdd, MdLogout } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import Avatar from "./Avatar";
import cx from "classnames";
import { MouseEventHandler, ReactElement, useState } from "react";
import { ReactNode } from "react";

interface PanelProps {
  /**
   * Fontion de déconnextion
   */
  signOut: () => void;
  /**
   * Fontion pour afficher le champ d'envoi de message
   */
  createMessage: () => void;
  /**
   * Lien vers la page d'accueil
   */
  homePage: string;
  /**
   * Lien vers la photo de profil du lecteur
   */
  avatarLink: string;
  /**
   * Nom du lecteur
   */
  name: string;
  /**
   * Lien vers le profil du lecteur
   */
  profileLink: string;
}

/**
 * Panneau de navigation contenant les actions principales
 */
const NavigationPanel = ({
  signOut,
  createMessage,
  homePage,
  avatarLink,
  name,
  profileLink,
}: PanelProps) => (
  <aside className="panel">
    <div className="title">
      <Link to={homePage}>
        <img className="logo" src="/logo192.png" alt="" />
      </Link>
    </div>
    <div className="search-input">
      <input autoComplete="on" type="search" />
      <button className="search-button">
        <ImSearch />
      </button>
    </div>
    <div className="panel-actions">
      <div title={name}>
        <Avatar picture={avatarLink} profileLink={profileLink} name={name} />
      </div>
      <NavigationPanel.Action
        icon={<MdAdd />}
        text="Créer un message"
        action={createMessage}
      />
      <NavigationPanel.Action
        icon={<MdLogout />}
        text="Se déconnecter"
        action={signOut}
      />
    </div>
  </aside>
);

interface BasePanelActionProps {
  icon: ReactNode;
  text: string;
}

interface ActionPanelActionProps extends BasePanelActionProps {
  link?: never;
  action: MouseEventHandler;
}

interface LinkPanelActionProps extends BasePanelActionProps {
  link: NavLinkProps["to"];
  action?: never;
}

type PanelActionProps = ActionPanelActionProps | LinkPanelActionProps;

/**
 * Élément constituant le panneau de navigation
 */
NavigationPanel.Action = ({ icon, text, link, action }: PanelActionProps) => {
  const Element = link ? NavLink : "div";
  //TODO: Typescript seems unable to discriminate between navlink and div props
  type Props = { to: NavLinkProps["to"]; onClick: typeof action };
  const props: Props = (link ? { to: link } : { onClick: action }) as Props;

  return (
    <li title={text} className="panel-action">
      <button className="panel-button">
        <Element {...props} className="action-wrapper">
          <span className="icon">{icon}</span>
        </Element>
      </button>
    </li>
  );
};

export default NavigationPanel;
