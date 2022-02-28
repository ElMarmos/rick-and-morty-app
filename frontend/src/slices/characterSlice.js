import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetCharacters, apiToggleFavorite } from "../api/api";

const initialState = {
  characters: null,
  charactersImages: {},
  currentPage: 1,
  nextPage: null,
  prevPage: null,
  totalPages: null,
  character: null,
  error: null,
};

export const getCharacters = createAsyncThunk(
  "characters/getCharacters",
  async (page) => {
    return (await apiGetCharacters(page)).data;
  }
);

export const toggleFavorite = createAsyncThunk(
  "characters/toggleFavorite",
  async (id, { getState }) => {
    const page = selectCurrentPage(getState());
    await apiToggleFavorite(id, page);

    return id;
  }
);

export const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    resetCharactersReducer: (state) => {
      localStorage.removeItem("page");
      return initialState;
    },
    selectCharacter: (state, action) => {
      state.character = state.characters[action.payload];
    },
    deselectCharacter: (state) => {
      state.character = null;
    },
    removeImageFromQueue: (state, { payload }) => {
      delete state.charactersImages[payload];
    },
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
      localStorage.setItem("page", payload);
      state.characters = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCharacters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCharacters.fulfilled,
        (state, { payload: { pages, next, prev, results } }) => {
          state.nextPage = next;
          state.prevPage = prev;
          state.totalPages = pages;

          const characters = {};
          results.forEach((character) => {
            characters[character.id] = character;
            state.charactersImages[character.id] = true;
          });

          state.characters = characters;
        }
      )
      .addCase(getCharacters.rejected, (state, { response }) => {
        state.error = response.message;
      })
      .addCase(toggleFavorite.fulfilled, (state, { payload }) => {
        state.characters[payload].isFavorite =
          !state.characters[payload].isFavorite;

        state.character.isFavorite = !state.character.isFavorite;
      })
      .addCase(toggleFavorite.rejected, (state, { response }) => {
        state.error = response.message;
      });
  },
});

export const {
  selectCharacter,
  deselectCharacter,
  removeImageFromQueue,
  setCurrentPage,
  resetCharactersReducer,
} = charactersSlice.actions;

export const selectCurrentPage = (state) => state.characters.currentPage;
export const selectNextPage = (state) => state.characters.nextPage;
export const selectPrevPage = (state) => state.characters.prevPage;
export const selectTotalPages = (state) => state.characters.totalPages;
export const selectCharacters = (state) => state.characters.characters;
export const selectCharactersImages = (state) =>
  state.characters.charactersImages;

export default charactersSlice.reducer;
