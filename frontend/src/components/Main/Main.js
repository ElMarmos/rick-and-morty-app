import { useSelector } from "react-redux";
import CharacterModal from "../CharacterModal/CharacterModal";
import CharacterList from "../Characters/CharactersList";
import Navbar from "../Navbar/Navbar";

const Main = () => {
  const character = useSelector((state) => state.characters.character);

  return (
    <>
      {character ? (
        <CharacterModal character={character}></CharacterModal>
      ) : null}
      <Navbar />
      <CharacterList />
    </>
  );
};

export default Main;
