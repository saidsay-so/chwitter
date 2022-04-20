import { createContext, ReactNode, useContext, useState } from "react";

import Toast, { Severity } from "../components/Toast";
import { CSSTransition } from "react-transition-group";

import "./ToastProvider.css";

interface Context {
  report: (msg: MessageReport) => void;
  messages: ToastMessage[];
}

export interface ToastMessage {
  content: string;
  severity: Severity;
}

export interface MessageReport extends Omit<ToastMessage, "content"> {
  error?: any;
}

const DEFAULT_TIMEOUT = 2500;

const ToastContext = createContext<Context>({} as Context);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const report = ({ error, ...msg }: MessageReport) => {
    const content =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : error.toString();

    setMessages((msgs) => [...msgs, { ...msg, content }]);

    //TODO: Clean
    setTimeout(
      () => setMessages((msgs) => msgs.slice(1, msgs.length)),
      DEFAULT_TIMEOUT
    );
  };

  return (
    <ToastContext.Provider value={{ report, messages }}>
      {children}
      <CSSTransition
        in={messages.length > 0}
        timeout={5000}
        classNames="toast-container"
        mountOnEnter
      >
        <div className="toast-container">
          {messages.length > 0 && <Toast {...messages[0]} />}
        </div>
      </CSSTransition>
    </ToastContext.Provider>
  );
};
