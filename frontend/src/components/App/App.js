import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login";
import Main from "../Main/Main";
import NotFound from "../NotFound/NotFound";
import Register from "../Register/Register";
import RequireAuth from "../RequireAuth/RequireAuth";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Main />
          </RequireAuth>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
