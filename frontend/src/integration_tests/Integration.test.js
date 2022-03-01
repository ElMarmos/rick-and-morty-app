import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "../util/test-util";
import App from "../components/App/App";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import charactersReducer from "../slices/characterSlice";
import { Provider } from "react-redux";

// Setup mock server
const server = setupServer(
  rest.post("/api/auth/login", (req, res, ctx) => {
    if (req.body.username === "rick") {
      return res(ctx.json({ token: "token" }));
    }

    return res(
      ctx.status(401),
      ctx.json({
        message: "Invalid username or password!",
      })
    );
  }),
  rest.get("/api/ram/characters", (req, res, ctx) => {
    if (req.url.searchParams.get("page") === "1") {
      return res(
        ctx.json({
          count: 2,
          pages: 2,
          next: 1,
          prev: null,
          results: [
            {
              id: 1,
              name: "Big Boobed Waitress",
              status: "Alive",
              species: "Mythological Creature",
              type: "",
              gender: "Female",
              origin: "Fantasy World",
              location: "Fantasy World",
              image: "https://rickandmortyapi.com/api/character/avatar/41.jpeg",
              episodes: [5],
              isFavorite: false,
            },
          ],
        })
      );
    } else if (req.url.searchParams.get("page") === "2") {
      return res(
        ctx.json({
          count: 2,
          pages: 2,
          next: null,
          prev: 1,
          results: [
            {
              id: 41,
              name: "Big Boobed Waitress",
              status: "Alive",
              species: "Mythological Creature",
              type: "",
              gender: "Female",
              origin: "Fantasy World",
              location: "Fantasy World",
              image: "https://rickandmortyapi.com/api/character/avatar/41.jpeg",
              episodes: [5],
              isFavorite: false,
            },
          ],
        })
      );
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("The app", () => {
  test("renders login and logins user into the app", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        characters: charactersReducer,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/not registered yet\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/username required!/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "wrong_user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/password required!/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await screen.findByText("Loading...");
    await screen.findByText("Invalid username or password!");

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "rick" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await screen.findByText("Big Boobed Waitress");
  });

  test("renders login and logins user into the app", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        characters: charactersReducer,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/not registered yet\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/username required!/i)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "rick" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/password required!/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await screen.findByText("Loading...");
    await screen.findByText("Big Boobed Waitress");
  });

  // test("renders Main component", async () => {
  //   const store = configureStore({
  //     reducer: {
  //       auth: authReducer,
  //       characters: charactersReducer,
  //     },
  //     preloadedState: {
  //       auth: {
  //         authenticated: true,
  //       },
  //     },
  //   });

  //   render(
  //     <Provider store={store}>
  //       <App />
  //     </Provider>
  //   );

  //   expect(
  //     screen.getByRole("button", {
  //       name: /exit/i,
  //     })
  //   ).toBeInTheDocument();

  //   expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  //   await screen.findByText("Big Boobed Waitress");
  //   expect(screen.getByText(/of 2 pages/i)).toBeInTheDocument();
  // });
});
