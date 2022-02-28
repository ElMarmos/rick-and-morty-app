import styled, { keyframes } from "styled-components";
import portal from "../../assets/img/portal.svg";

const rotate = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  position: relative;
  height: ${({ size }) => (size === "s" ? "130px" : "325px")};
  width: 100%;
`;

const LoadingImage = styled.img`
  display: inline-block;
  animation: ${rotate} 4s linear infinite;
  height: ${({ size }) => (size === "s" ? "100px" : "250px")};
  position: absolute;
  top: 50%;
  left: 50%;
`;

const LoadingText = styled.p`
  font-size: ${({ size }) => (size === "s" ? "14px" : "30px")};
  font-weight: bold;
  position: absolute;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff,
    1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
`;

const Loading = ({ size }) => {
  return (
    <LoadingContainer size={size}>
      <LoadingImage src={portal} alt="Portal" size={size} />
      <LoadingText size={size}>Loading...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
