import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { deselectCharacter } from "../../slices/characterSlice";
import CharacterDetail from "./CharacterDetail";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`;

const Backdrop = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const CharacterModal = ({ character }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const closeModal = (e) => {
      if (e.which === 27) dispatch(deselectCharacter());
    };

    document.addEventListener("keydown", closeModal, false);

    return () => {
      document.removeEventListener("keydown", closeModal, false);
    };
  }, [dispatch]);

  return (
    <Container>
      <Backdrop onClick={() => dispatch(deselectCharacter())}></Backdrop>
      <CharacterDetail data={character} />
    </Container>
  );
};

export default CharacterModal;
