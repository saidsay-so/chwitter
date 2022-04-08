import React from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import reportWebVitals from "./reportWebVitals";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./providers/AuthProvider";
import RequireAuthProvider from "./providers/RequireAuthProvider";
import UserMessages from "./pages/user/Messages";
import UserFriends from "./pages/user/Friends";
import { Navigate } from "react-router-dom";

import "dayjs/locale/fr";
import dayjs from "dayjs";
dayjs.locale("fr");

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/users/:id"
              element={
                <RequireAuthProvider>
                  <UserProfile />
                </RequireAuthProvider>
              }
            >
              <Route index element={<Navigate to="messages" replace />} />
              <Route
                path="messages"
                element={
                  <RequireAuthProvider>
                    <UserMessages />
                  </RequireAuthProvider>
                }
              />
              <Route
                path="friends"
                element={
                  <RequireAuthProvider>
                    <UserFriends />
                  </RequireAuthProvider>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.info);
