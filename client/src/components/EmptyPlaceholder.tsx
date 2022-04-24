import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import "./EmptyPlaceholder.css";

export const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <RiCheckboxBlankCircleLine />
    <h2>C'est vide !</h2>
  </div>
);
