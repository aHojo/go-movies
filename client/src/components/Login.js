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
    let value = this.target.value;
    let name = this.target.name;

    this.setState((prevState) => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1
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
            onChange={this.handleChange}
            className={this.hasError('email') ? "is-invalid" : ""}
            errorDiv={this.hasError('email') ? "text-danger" : "d-none"}
            errorMsg="Please enter a valid email address"
          />
          <Input 
            type="password"
            name="password"
            placeholder="Email"
            value={this.state.password}
            onChange={this.handleChange}
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