import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Movies from './components/Movies';
import Admin from './components/Admin';
import Home from './components/Home';
import OneMovie from './components/OneMovie';
import Genres from './components/Genres';
import OneGenre from './components/OneGenre';
import EditMovie from './components/EditMovie';
import Login from './components/Login';

export default class App extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      jwt: "",
    }
  }

  handleJWTChange = (jwt) => {
    this.setState({
      jwt
    })
  }

  logout = () => {
    this.setState({
      jwt: ""
    })
  }

  render() {
    let LoginLink;
    if (this.state.jwt === "") {
      LoginLink = <Link to="/login">Login</Link>
    } else {
      LoginLink = <Link to="/logout" onClick={this.logout}>Logout</Link>

    }
    return (
      <Router>
        <div className="container">

          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">
                Go Watch a Movie!
              </h1>
            </div>
            <div className="col mt-3 text-end">
              {LoginLink}
            </div>
            <hr className="mb-3"></hr>
          </div>

          <div className="row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/movies">Movies</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/genres">Genres</Link>
                  </li>
                  {this.state.jwt !== "" &&
                    < React.Fragment >
                      <li className="list-group-item">
                        <Link to="/admin/movie/0">Add Movie</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Manage Catalogue</Link>
                      </li>
                    </React.Fragment>
                  }
                </ul>
              </nav>
            </div>

            <div className="col-md-10">
              <Switch>

                <Route path="/movies/:id" component={OneMovie} />

                <Route path="/movies">
                  <Movies />
                </Route>
                <Route exact path="/genres">
                  <Genres />
                </Route>
                <Route path="/genres/:id" component={OneGenre} />

                <Route exact path="/login" 
                component={(props) => <Login {...props} handleJWTChange={this.handleJWTChange} />} />

                <Route path="/admin/movie/:id" component={EditMovie} />
                <Route path="/admin">
                  <Admin />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router >
    );
  }
}
