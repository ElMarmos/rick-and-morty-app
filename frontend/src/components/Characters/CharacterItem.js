import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  removeImageFromQueue,
  selectCharacter,
} from "../../slices/characterSlice";
import star from "../../assets/img/star.png";
import starEmpty from "../../assets/img/star-empty.png";

const Container = styled.button`
  background: ${(props) =>
    props.isFavorite ? props.theme.yellow : props.theme.blue};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 220px;
  height: 220px;
  cursor: pointer;
  border-radius: 10px;
  padding: 0;
  outline: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  position: relative;
  overflow: hidden;
  padding: 15px;
  z-index: 1;

  &:focus,
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    transform: translateY(-5px);
  }

  &::before {
    content: "";
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    height: 78%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  &::after {
    content: "";
    background: white;
    height: 50%;
    width: 100%;
    position: absolute;
    top: 65%;
    border-radius: 30px 30px 0 0;
    left: 0;
    z-index: -1;
  }
`;

const FavoriteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FavoriteButton = styled.div`
  display: inline-block;
  height: 32px;
  width: 32px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border: 1px solid
    ${({ isFavorite, theme }) => (isFavorite ? theme.yellow : theme.disabled)};
  padding-top: 4px;

  img {
    height: 20px;
  }
`;

const CharacterImage = styled.img`
  height: 110px;
  width: 110px;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const Name = styled.h3`
  text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff,
    1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
  margin: 15px 0 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 3px;
`;

const CharacterItem = ({ id, name, image, isFavorite }) => {
  const dispatch = useDispatch();

  const dispatchImageLoaded = (e) => {
    dispatch(removeImageFromQueue(id));
  };

  return (
    <Container
      isFavorite={isFavorite}
      onClick={() => dispatch(selectCharacter(id))}
    >
      <FavoriteButtonContainer>
        {isFavorite ? (
          <FavoriteButton isFavorite={true}>
            <img src={star} alt="Favorite" />
          </FavoriteButton>
        ) : (
          <FavoriteButton>
            <img src={starEmpty} alt="Not Favorite" />
          </FavoriteButton>
        )}
      </FavoriteButtonContainer>
      <Name>{name}</Name>
      <CharacterImage src={image} onLoad={(e) => dispatchImageLoaded(e)} />
    </Container>
  );
};

export default CharacterItem;
