import styled from "styled-components";

const FormControlContainer = styled.label`
  display: block;
  margin-bottom: 15px;
`;

const FormLabel = styled.p`
  font-size: 14px;
  margin: 0;
  font-weight: bold;
  text-align: left;
  text-transform: lowercase;
`;

const FormInput = styled.input`
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 8px 15px;
  font-size: 16px;
`;

const FormControl = ({ text, type = "text", value, onChange, ...rest }) => {
  return (
    <FormControlContainer {...rest}>
      <FormLabel>{text}</FormLabel>
      <FormInput value={value} type={type} onChange={onChange} />
    </FormControlContainer>
  );
};

export default FormControl;
