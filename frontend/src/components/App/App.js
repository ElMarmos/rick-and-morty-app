import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Main from "../../pages/Main/Main";
import NotFound from "../../pages/NotFound/NotFound";
import Register from "../../pages/Register/Register";
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
