import { Trans } from "@lingui/macro";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import "./EmptyPlaceholder.css";

export const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <RiCheckboxBlankCircleLine />
    <h2>
      <Trans>C'est vide !</Trans>
    </h2>
  </div>
);
