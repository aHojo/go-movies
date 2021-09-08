import React, { Component } from 'react'
import Input from './form-components/Input'
import Alert from './ui-components/Alert'


export default class Login extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: '',
      errors: [],
      alert: {
        type: "d-none",
        message: '',
      }
    }
  }

  handleChange = (e) => {
    e.preventDefault()
    let value = e.target.value;
    let name = e.target.name;

    this.setState((prevState) => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    let errors = [];

    if (this.state.email === '') {
      errors.push('email')
    }
    if (this.state.password === '') {
      errors.push('password')
    }
    if (errors.length > 0) {
      this.setState({
        errors: errors
      })
      return false;
    }

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());
    const request = {
      method: "POST",
      body: JSON.stringify(payload),
    }

    try {

      const response = await fetch('http://localhost:4000/v1/signin', request)
      const json = await response.json();
      if (json.error) {
        this.setState({
          alert: {
            type: "alert alert-danger",
            message: json.error.message
          }
        })
        return false;
      } 
      this.handleJWTChange(json);
      window.localStorage.setItem('jwt', JSON.stringify(json.jwt));
    } catch (error) {
      console.log(error)
    }

  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1
  }

  handleJWTChange({jwt}) {
    this.props.handleJWTChange(jwt);
    this.props.history.push({
      pathname: "/admin"
    })
  }

  render() {

    return (
      <React.Fragment>
        <h2>Login</h2>
        <hr />
        <Alert 
          alertType={this.state.alert.type}
          message={this.state.alert.message}
        />
        <form className="pt-3" onSubmit={this.handleSubmit}>
          <Input 
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            handleChange={this.handleChange}
            className={this.hasError('email') ? "is-invalid" : ""}
            errorDiv={this.hasError('email') ? "text-danger" : "d-none"}
            errorMsg="Please enter a valid email address"
          />
          <Input 
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            handleChange={this.handleChange}
            className={this.hasError('password') ? "is-invalid" : ""}
            errorDiv={this.hasError('password') ? "text-danger" : "d-none"}
            errorMsg="Please enter a valid password"
          />
          <hr></hr>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </React.Fragment>
    );
  }
}