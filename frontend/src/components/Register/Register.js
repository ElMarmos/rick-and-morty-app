import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiRegister } from "../../api/api";
import FormControl from "../FormControl/FormControl";
import Loading from "../Loading/Loading";

const LoginContainer = styled.div`
  padding: 60px 15px;
`;

const LoginBox = styled.form`
  margin: 0 auto;
  background-color: white;
  max-width: 300px;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  z-index: 0;
  text-align: center;
`;

const H2 = styled.h2`
  text-align: center;
  margin: 0;
  margin-bottom: 40px;
`;

const SubmitButton = styled.input`
  background-color: ${(props) => props.theme.blue};
  font-weight: bold;
  text-transform: uppercase;
  border: 1px solid transparent;
  padding: 8px 15px;
  outline: none;
  border-radius: 3px;
  transition: border 0.1s;
  cursor: pointer;
  margin-bottom: 15px;

  &:focus {
    border: 1px solid black;
  }

  &:hover {
    border: 1px solid black;
  }

  &:disabled {
    background-color: ${(props) => props.theme.disabled};
    cursor: initial;
  }
`;

const Message = styled.p`
  color: ${(props) =>
    props.color === "red" ? props.theme.red : props.theme.green};
`;

const ModifiedFormControl = styled(FormControl)`
  margin-bottom: 30px;
`;

const NotRegisterDiv = styled.div`
  font-size: 14px;
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    if (!username || username.length === 0 || username.length > 36) {
      setMessage("Username should be 1-36 characters  of length!");
      setStatus("failed");
      return;
    }

    if (!password || password.length < 8 || password.length > 36) {
      setMessage("Password should be 8-36 characters of length!");
      setStatus("failed");
      return;
    }

    if (password !== repeatPass) {
      setMessage("Passwords must match!");
      setStatus("failed");
      return;
    }

    setMessage("");
    setStatus("pending");

    try {
      await apiRegister(username, password);

      setStatus("succeeded");
      setMessage("Successfully registered! Being redirected to login page...");

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (e) {
      setStatus("failed");
      setMessage(e.response.data.message);
    }
  };

  return (
    <LoginContainer>
      <LoginBox onSubmit={(e) => register(e)}>
        <H2>Register</H2>
        <FormControl
          text="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormControl
          text="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ModifiedFormControl
          text="Repeat password"
          type="password"
          value={repeatPass}
          onChange={(e) => setRepeatPass(e.target.value)}
        />
        {message && (
          <Message color={status === "failed" ? "red" : ""}>{message}</Message>
        )}
        {status !== "pending" ? (
          <div>
            <SubmitButton
              disabled={status === "pending" || status === "succeeded"}
              type="submit"
              value="Register"
            />
            <NotRegisterDiv>
              Already register? {<Link to="/login">Login</Link>}
            </NotRegisterDiv>
          </div>
        ) : (
          <Loading size={"s"} />
        )}
      </LoginBox>
    </LoginContainer>
  );
};

export default Register;
