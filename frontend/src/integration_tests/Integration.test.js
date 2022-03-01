import "@testing-library/jest-dom";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "../util/test-util";
import App from "../components/App/App";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import charactersReducer from "../slices/characterSlice";
import { Provider } from "react-redux";

// Setup mock server
const server = setupServer(
  rest.post("/api/users", (req, res, ctx) => {
    if (req.body.username === "rick") {
      return res(ctx.status(200));
    }

    return res(
      ctx.status(422),
      ctx.json({
        message: "The username was already taken!",
      })
    );
  }),
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
  rest.put("/api/ram/characters", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/api/ram/characters", (req, res, ctx) => {
    if (req.url.searchParams.get("page") === "1") {
      return res(
        ctx.json({
          count: 2,
          pages: 2,
          next: 2,
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
              location: "Neverland",
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
              id: 2,
              name: "Rick Sanchez",
              status: "Alive",
              species: "Human",
              type: "",
              gender: "Male",
              origin: "Earth",
              location: "Citadel of Ricks",
              image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
              episodes: [1, 2, 3],
              isFavorite: true,
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
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/not registered yet\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/username required!/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "wrong_user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/password required!/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await screen.findByText("Loading...");
    await screen.findByText("Invalid username or password!");

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "rick" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await screen.findByText("Big Boobed Waitress");
  });

  test("registers a new user and redirects to login", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.click(screen.getByRole("link", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /register/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Repeat password")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "rack" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345678" },
    });

    fireEvent.change(screen.getByLabelText("Repeat password"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await screen.findByText(/the username was already taken!/i);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "rick" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await new Promise((r) => setTimeout(r, 4000));

    await waitForElementToBeRemoved(
      screen.getByRole("heading", { name: /register/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
    });
  });

  test("renders main component and navigates to other page", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        characters: charactersReducer,
      },
      preloadedState: {
        auth: {
          authenticated: true,
        },
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(
      screen.getByRole("button", {
        name: /exit/i,
      })
    ).toBeInTheDocument();

    await screen.findByText(/loading.../i);
    await screen.findByText("Big Boobed Waitress");
    expect(screen.getByText(/of 2 pages/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(">"));

    await screen.findByText("Rick Sanchez");

    fireEvent.click(screen.getByText("<"));

    await screen.findByText("Big Boobed Waitress");

    fireEvent.change(screen.getByTestId("page-input"), {
      target: { value: "2" },
    });
    fireEvent.keyPress(screen.getByTestId("page-input"), {
      key: "Enter",
      code: 13,
      charCode: 13,
    });

    await screen.findByText("Rick Sanchez");
  });

  test("renders main component and handles character modal", async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        characters: charactersReducer,
      },
      preloadedState: {
        auth: {
          authenticated: true,
        },
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await screen.findByText("Big Boobed Waitress");

    fireEvent.click(screen.getByText("Big Boobed Waitress"));

    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/alive/i)).toBeInTheDocument();
    expect(screen.getByText(/species/i)).toBeInTheDocument();
    expect(screen.getByText(/mythological creature/i)).toBeInTheDocument();
    expect(screen.getByText(/type/i)).toBeInTheDocument();
    expect(screen.getByText(/-/i)).toBeInTheDocument();
    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByText(/female/i)).toBeInTheDocument();
    expect(screen.getByText(/origin/i)).toBeInTheDocument();
    expect(screen.getByText(/fantasy world/i)).toBeInTheDocument();
    expect(screen.getByText(/location/i)).toBeInTheDocument();
    expect(screen.getByText(/neverland/i)).toBeInTheDocument();
    expect(screen.getByText(/episodes/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("not-favorite-button"));

    await screen.findByTestId("favorite-button");

    fireEvent.click(screen.getByTestId("modal-backdrop"));

    expect(screen.queryByText(/mythological creature/i)).toBeNull();
    expect(screen.queryByTestId("modal-backdrop")).toBeNull();
  });
});
