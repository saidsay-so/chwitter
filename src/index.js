import React from "react";
import ReactDOM from "react-dom";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import reportWebVitals from "./reportWebVitals";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./providers/AuthProvider";
import UserMessages from "./pages/user/Messages";
import UserFriends from "./pages/user/Friends";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users/:id" element={<UserProfile />}>
              <Route index element={<UserMessages />} />
              <Route path="messages" element={<UserMessages />} />
              <Route path="friends" element={<UserFriends />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.info);
