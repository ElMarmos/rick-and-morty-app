import { useDispatch } from "react-redux";
import styled from "styled-components";
import { logout } from "../../slices/authSlice";
import { resetCharactersReducer } from "../../slices/characterSlice";

const NavbarContainer = styled.nav`
  height: 60px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 500;
`;

const ExitButton = styled.button`
  background-color: ${(props) => props.theme.red};
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  border: 1px solid transparent;
  padding: 8px 15px;
  outline: none;
  border-radius: 3px;
  transition: border 0.1s;
  cursor: pointer;

  &:focus {
    border: 1px solid ${(props) => props.theme.black};
  }

  &:hover {
    border: 1px solid ${(props) => props.theme.black};
  }

  &:disabled {
    background-color: ${(props) => props.theme.disabled};
    cursor: initial;
  }
`;

const Navbar = () => {
  const dispatch = useDispatch();

  const exit = () => {
    dispatch(logout());
    dispatch(resetCharactersReducer());
  };

  return (
    <NavbarContainer>
      <ExitButton onClick={() => exit()}>Exit</ExitButton>
    </NavbarContainer>
  );
};

export default Navbar;
