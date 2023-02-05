import { Trans } from "@lingui/macro";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import "./EmptyPlaceholder.css";

export const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <RiCheckboxBlankCircleLine />
    <h2>
      <Trans>Circulez, y'a rien à voir!</Trans>
    </h2>
  </div>
);
