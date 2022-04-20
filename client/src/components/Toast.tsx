import cx from "classnames";
import {
  MdErrorOutline,
  MdInfoOutline,
  MdOutlineWarning,
} from "react-icons/md";

import "./Toast.css";

export const enum Severity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

const Icons = {
  [Severity.ERROR]: MdErrorOutline,
  [Severity.WARNING]: MdOutlineWarning,
  [Severity.INFO]: MdInfoOutline,
};

interface ToastProps {
  content: string;
  severity: Severity;
}

const Toast = ({ content, severity }: ToastProps) => {
  const Icon = Icons[severity];

  return (
    <div className={cx("toast", severity)}>
      <div className="toast-icon">
        <Icon className="icon" />
      </div>
      {content}
    </div>
  );
};

export default Toast;
