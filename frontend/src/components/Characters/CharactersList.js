import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  getCharacters,
  selectCharacters,
  selectCharactersImages,
  selectCurrentPage,
} from "../../slices/characterSlice";
import Controls from "../Controls/Controls";
import Loading from "../Loading/Loading";
import CharacterItem from "./CharacterItem";

const CharacterListContainer = styled.div`
  height: 100%;
  display: ${(props) => (props.hide ? "none" : "flex")};
  align-items: center;
  padding: 75px 15px;
  text-align: center;
`;

const Characters = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 15px;
  justify-items: center;
  align-items: center;
  margin: 0 auto;
`;

const CenterItem = styled.div`
  display: ${(props) => (props.hide ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const CharacterList = () => {
  const dispatch = useDispatch();
  const characters = useSelector(selectCharacters);
  const currentPage = useSelector(selectCurrentPage);
  const charactersImagesQueue = useSelector(selectCharactersImages);

  useEffect(() => {
    if (!characters) {
      dispatch(getCharacters(currentPage));
    }
  }, [characters, currentPage, dispatch]);

  return (
    <>
      <CenterItem hide={Object.keys(charactersImagesQueue).length === 0}>
        <Loading />
      </CenterItem>
      {characters && (
        <CharacterListContainer
          hide={Object.keys(charactersImagesQueue).length !== 0}
        >
          <Characters>
            {Object.entries(characters).map(
              ([key, { id, name, image, isFavorite }]) => {
                return (
                  <CharacterItem
                    key={key}
                    id={id}
                    name={name}
                    image={image}
                    isFavorite={isFavorite}
                  />
                );
              }
            )}
          </Characters>
          <Controls />
        </CharacterListContainer>
      )}
    </>
  );
};

export default CharacterList;
