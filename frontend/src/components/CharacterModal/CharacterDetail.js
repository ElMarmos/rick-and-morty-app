import { useDispatch } from "react-redux";
import styled from "styled-components";
import { toggleFavorite } from "../../slices/characterSlice";
import star from "../../assets/img/star.png";
import starEmpty from "../../assets/img/star-empty.png";

const Container = styled.div`
  background: ${(props) =>
    props.isFavorite ? props.theme.yellow : props.theme.blue};
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  position: absolute;
  overflow: hidden;
  padding: 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &::before {
    content: "";
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    height: 55%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
`;

const FavoriteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FavoriteButton = styled.button`
  display: inline-block;
  height: 40px;
  width: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding-top: 5px;
  border: 2px solid
    ${({ isFavorite, theme }) => (isFavorite ? theme.yellow : theme.disabled)};
  cursor: pointer;

  img {
    height: 25px;
  }
`;

const Name = styled.h2`
  text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff,
    1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
  margin: 15px 0 0;
  text-align: center;
  padding: 0 3px ${({ theme }) => theme.yellow};
`;

const ImagePanel = styled.div`
  height: 210px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    background: white;
    height: 50%;
    position: absolute;
    top: 50%;
    left: -15px;
    right: -15px;
    border-radius: 30px 30px 0 0;
    z-index: -1;
  }
`;

const CharacterImage = styled.img`
  height: 180px;
  width: 180px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const DataPanel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  background-color: white;
  margin: -15px;
  padding: 15px;
`;

const Data = styled.div`
  grid-column-end: span 2;
`;

const DataName = styled.h4`
  margin: 0;
  color: #999999;
`;

const DataValue = styled.p`
  margin: 0;
  font-size: 18px;
`;

const EpisodesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
`;

const Episode = styled.div`
  display: inline-block;
  font-size: 18px;
`;

const CharacterDetail = ({
  data: {
    id,
    name,
    status,
    species,
    type,
    gender,
    origin,
    location,
    image,
    episodes,
    isFavorite,
  },
}) => {
  const dispatch = useDispatch();

  return (
    <Container isFavorite={isFavorite}>
      <FavoriteButtonContainer>
        {isFavorite ? (
          <FavoriteButton
            autoFocus
            onClick={() => dispatch(toggleFavorite(id))}
            isFavorite={true}
          >
            <img src={star} alt="Favorite" />
          </FavoriteButton>
        ) : (
          <FavoriteButton
            autoFocus
            onClick={() => dispatch(toggleFavorite(id))}
          >
            <img src={starEmpty} alt="Not Favorite" />
          </FavoriteButton>
        )}
      </FavoriteButtonContainer>
      <Name>{name}</Name>
      <ImagePanel>
        <CharacterImage src={image} />
      </ImagePanel>
      <DataPanel>
        <div>
          <DataName>status</DataName>
          <DataValue>{status}</DataValue>
        </div>
        <div>
          <DataName>species</DataName>
          <DataValue>{species}</DataValue>
        </div>
        <div>
          <DataName>type</DataName>
          <DataValue>{type || "-"}</DataValue>
        </div>
        <div>
          <DataName>gender</DataName>
          <DataValue>{gender}</DataValue>
        </div>
        <div>
          <DataName>origin</DataName>
          <DataValue>{origin}</DataValue>
        </div>
        <div>
          <DataName>location</DataName>
          <DataValue>{location}</DataValue>
        </div>
        <Data>
          <DataName>episodes</DataName>
          <EpisodesContainer>
            {episodes.map((ep, idx) => (
              <Episode key={idx}>{ep}</Episode>
            ))}
          </EpisodesContainer>
        </Data>
      </DataPanel>
    </Container>
  );
};

export default CharacterDetail;
