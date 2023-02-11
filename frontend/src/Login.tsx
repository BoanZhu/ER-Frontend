import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(true);

  const navigate = useNavigate();

  function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    onSubmit(username, password);
    setUsername('');
    setPassword('');
    setIsDisabled(true);
  }

  function onSubmit(username: string, password: string) {
    alert(`You entered: ${username} and password ${password}`);
    if (username === 'test' && password === 'test') {
        navigate('drawing');
    }
  }

  function handleUsernameChange(event: { target: { value: string; }; }) {
    setUsername(event.target.value.toLowerCase());
  }

  function handlePasswordChange(event: { target: { value: string; }; }) {
    setPassword(event.target.value.toLowerCase());
  }

  useEffect(() => {
    if (password !== '' && username !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [username, password]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username-input">Username:</label>
        <input
          id="username-input"
          type="text"
          onChange={handleUsernameChange}
          value={username}
        />
      </div>
      <div>
        <label htmlFor="password-input">Password:</label>
        <input
          id="password-input"
          type="password"
          onChange={handlePasswordChange}
          value={password}
        />
      </div>
      <button id="login-button" type="submit" disabled={isDisabled}>
        Submit
      </button>
    </form>
  );
};

export default Login;
