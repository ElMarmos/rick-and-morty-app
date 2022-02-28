import styled from "styled-components";
import img404 from "../../assets/img/404.png";

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 15px;
`;

const Img = styled.img`
  width: 100%;
  max-width: 500px;
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Img src={img404} alt="404" />
    </NotFoundContainer>
  );
};

export default NotFound;
