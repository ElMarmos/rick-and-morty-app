import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import "./assets/styles/index.css";
import theme from "./constants/theme";
import patternImg from "./assets/img/pattern.png";
import { login } from "./slices/authSlice";
import { setCurrentPage } from "./slices/characterSlice";

const GlobalStyle = createGlobalStyle`

  html {
    scroll-behavior: smooth;
    height: 100%;
  }

  body {
    background: url(${patternImg});
    background-size: 250px;
    color: ${(props) => props.theme.black};
    font-family: 'Neucha', cursive;
    margin: 0;
    height: 100%;
  }

  #root {
    height: 100%;
  }

  input {
    font-family: 'Neucha', cursive;
  }

  *,
  *:before,
  *:after {
    box-sizing:border-box;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  button,
  input[type='submit'] {
    font-family: 'Patrick Hand SC', cursive;
  }
`;

const token = localStorage.getItem("token");

if (token) {
  store.dispatch(login(token));
}

const page = localStorage.getItem("page");
if (page) {
  store.dispatch(setCurrentPage(page));
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
