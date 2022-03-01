import { useSelector } from "react-redux";
import CharacterModal from "../../components/CharacterModal/CharacterModal";
import CharacterList from "../../components/Characters/CharactersList";
import Navbar from "../../components/Navbar/Navbar";

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
