import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  selectCurrentPage,
  selectNextPage,
  selectPrevPage,
  selectTotalPages,
  setCurrentPage,
} from "../../slices/characterSlice";

const Container = styled.div`
  position: fixed;
  height: 60px;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 500;
`;

const ControlsContainer = styled.div`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  height: 50px;
  display: inline-flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.blue};
  border-radius: 50px;
  overflow: hidden;
`;

const BasicButton = styled.button`
  background: none;
  border: none;
  font-size: 40px;
  line-height: 30px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
  padding: 0 15px 10px;
  color: white;
  border-radius: 0;
  outline: none;

  &:disabled {
    cursor: default;
    color: ${(props) => props.theme.blue};
  }

  &:focus {
    color: black;
  }
`;

const NextButton = styled(BasicButton)`
  justify-content: flex-end;
`;

const MiddlePanel = styled.div`
  height: 100%;
  color: white;
  font-family: "Patrick Hand SC", sans-serif;
  font-size: 24px;
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  margin: 0 10px;
`;

const CurrentPageInput = styled.input`
  border: none;
  border-bottom: 2px solid white;
  width: 40px;
  margin-right: 5px;
  font-size: 24px;
  background: transparent;
  text-align: center;
  padding: 0;
  color: white;
  font-family: "Patrick Hand SC", sans-serif;
  -moz-appearance: textfield;
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border-bottom: 2px solid black;
  }
`;

const TextSpan = styled.span``;

const Controls = () => {
  const dispatch = useDispatch();
  const prevPage = useSelector(selectPrevPage);
  const nextPage = useSelector(selectNextPage);
  const totalPages = useSelector(selectTotalPages);
  const [page, setPage] = useState(useSelector(selectCurrentPage));

  const onKeyPress = (e) => {
    if (e.which === 13) {
      if (page < 1) return dispatch(setCurrentPage(1));
      if (page > totalPages) return dispatch(setCurrentPage(totalPages));
      dispatch(setCurrentPage(page));
    }
  };

  return (
    <Container>
      <ControlsContainer>
        <BasicButton
          onClick={() => dispatch(setCurrentPage(prevPage))}
          disabled={prevPage == null}
        >
          &lt;
        </BasicButton>
        <MiddlePanel>
          <CurrentPageInput
            type="number"
            value={page}
            data-testid="page-input"
            onChange={(e) => setPage(e.target.value)}
            onKeyPress={(e) => onKeyPress(e)}
          />
          <TextSpan>of {totalPages} pages</TextSpan>
        </MiddlePanel>
        <NextButton
          onClick={() => dispatch(setCurrentPage(nextPage))}
          disabled={nextPage == null}
        >
          &gt;
        </NextButton>
      </ControlsContainer>
    </Container>
  );
};

export default Controls;
