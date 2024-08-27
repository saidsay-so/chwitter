import "./NavigationPanel.css";
import "./NavigationPanelAction.css";
import { Link, NavLink, NavLinkProps } from "react-router-dom";
import {
  MdAdd,
  MdDarkMode,
  MdLightMode,
  MdLogin,
  MdLogout,
} from "react-icons/md";
import { ImSearch } from "react-icons/im";
import Avatar from "./Avatar";
import { FormEventHandler, MouseEventHandler } from "react";
import { ReactNode } from "react";
import { t } from "@lingui/macro";
import { User } from "../services/user";

interface PanelProps {
  /**
   * Fontion de déconnextion
   */
  signOut: () => void;
  /**
   * Fontion pour afficher le champ d'envoi de message
   */
  createMessage: () => void;
  switchColorScheme: () => void;
  colorScheme: "light" | "dark";
  search: string;
  onSearchSubmit: FormEventHandler<HTMLFormElement>;
  onSearchInput: FormEventHandler<HTMLInputElement>;
  /**
   * Lien vers la page d'accueil
   */
  homePage: string;
  user: User | null;
}

/**
 * Panneau de navigation contenant les actions principales
 */
const NavigationPanel = ({
  signOut,
  createMessage,
  switchColorScheme,
  colorScheme,
  onSearchSubmit,
  onSearchInput,
  search,
  homePage,
  user,
}: PanelProps) => {
  return (
    <aside className="panel">
      <div className="title">
        <Link to={homePage}>
          <img className="logo" src="/logo192.png" alt="" />
        </Link>
      </div>
      {user && (
        <div className="search-input">
          <form onSubmit={onSearchSubmit}>
            <input
              value={search}
              onInput={onSearchInput}
              autoComplete="on"
              type="search"
            />
          </form>
          <button className="search-button">
            <ImSearch />
          </button>
        </div>
      )}

      <div className="panel-actions">
        {user && <NavigationPanel.AvatarButton {...user} />}
        {user && (
          <NavigationPanel.Action
            icon={<MdAdd />}
            text={t`Créer un message`}
            action={createMessage}
          />
        )}
        <NavigationPanel.Action
          icon={colorScheme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          text={t`Changer le thème`}
          action={switchColorScheme}
        />
        {user ? (
          <NavigationPanel.Action
            icon={<MdLogout />}
            text={t`Se déconnecter`}
            action={signOut}
          />
        ) : (
          <NavigationPanel.Action
            icon={<MdLogin />}
            text={t`Se connecter`}
            action={signOut}
          />
        )}
      </div>
    </aside>
  );
};

NavigationPanel.AvatarButton = ({ avatarLink, name, profileLink }: User) => {
  return (
    <div title={name}>
      <Avatar picture={avatarLink} profileLink={profileLink} name={name} />
    </div>
  );
};

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
