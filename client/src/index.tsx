import React from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import "./index.css";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastProvider } from "./providers/ToastProvider";
import RequireAuthProvider from "./providers/RequireAuthProvider";
import UserMessages from "./pages/user/Messages";
import UserFriends from "./pages/user/Friends";
import Search from "./pages/Search";
import { Navigate } from "react-router-dom";
import EditProfile from "./pages/EditProfile";
import HomeFeed from "./pages/HomeFeed";
import UserLikedMessages from "./pages/user/LikedMessages";
import NotFound from "./pages/NotFound";

import "dayjs/locale/fr";
import "dayjs/locale/en";
import dayjs from "dayjs";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fr as frPlural, en as enPlural } from "make-plural/plurals";
import { messages as fr } from "./locales/fr/messages";
import { messages as en } from "./locales/en/messages";

const languages = {
  fr,
  en,
};

i18n.load(languages);

const rawLocale = navigator.language.split("-")[0];
const locale = rawLocale in languages ? rawLocale : "en";
i18n.loadLocaleData({
  en: { plurals: enPlural },
  fr: { plurals: frPlural },
});
i18n.activate(locale);
dayjs.locale(locale);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider i18n={i18n}>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <RequireAuthProvider>
                    <MainLayout />
                  </RequireAuthProvider>
                }
              >
                <Route path="/" element={<HomeFeed />} />
                <Route path="/search" element={<Search />} />
                <Route path="/edit" element={<EditProfile />} />
                <Route path="/users/:id" element={<UserProfile />}>
                  <Route index element={<Navigate to="messages" replace />} />
                  <Route path="messages" element={<UserMessages />} />
                  <Route path="friends" element={<UserFriends />} />
                  <Route path="likedMessages" element={<UserLikedMessages />} />
                </Route>
              </Route>
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);
