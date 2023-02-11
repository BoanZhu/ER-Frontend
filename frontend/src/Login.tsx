import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

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
    // alert(`You entered: ${username} and password ${password}`);
    // 10.187.204.209

    let is_success = true;
    const request ={
        "username": "test",
        "password": "test"
    }
    // info = JSON.stringify(info);
    $.ajax({
        async: false,
        type: "POST",
        url: "http://10.187.204.209:8080/er/login/check_account",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success!");
        },
        error: function(result) {
            is_success = false;
            alert(JSON.parse(result.responseText).data);
        }
    });

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
