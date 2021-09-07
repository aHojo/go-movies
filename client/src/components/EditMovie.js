import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Input from './form-components/Input';
import TextArea from './form-components/TextArea';
import Select from './form-components/Select';
import Alert from './ui-components/Alert';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class EditMovie extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movie: {
        id: 0,
        title: '',
        release_date: '',
        runtime: '',
        mpaa_rating: '',
        rating: '',
        description: '',
      },
      mpaaOptions: [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
      ],
      isLoaded: false,
      error: null,
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hasError = this.hasError.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();

    // Client Side validation
    let errors = [];

    if (this.state.movie.title.length < 1) {
      errors.push("title");
    }

    this.setState({ errors });

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());
    console.log(payload);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
    }

    const result = await fetch(`http://localhost:4000/v1/admin/editmovie`, requestOptions)
    const json = await result.json();

    if (json.error) {
      this.setState({
        alert: { type: "alert-danger", message: json.error.message }
      })
    } else {
      this.setState({
        alert: { type: "alert-success", message: "Changes saved!" }
      })
      setTimeout(() => {
        this.props.history.push({pathname: '/admin'});

      }, 500)
    }
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.setState((prevState) => {
      return {
        movie: {
          ...prevState.movie,
          [name]: value
        }
      }
    });
  }

  hasError(key) {
    return this.state.errors.indexOf(key) > -1;
  }

  async componentDidMount() {
    const id = this.props.match.params.id;

    if (id > 0) {
      const result = await fetch(`http://localhost:4000/v1/movie/${id}`)
      if (result.status !== 200) {
        let err = new Error();
        err.message = "Invalid Response: " + Response.status;
        this.setState({ error: err });
      }
      const json = await result.json();
      console.log(result.status, json);
      const releaseDate = new Date(json.movie.release_date);

      this.setState({
        movie: {
          id: id,
          title: json.movie.title,
          release_date: releaseDate.toISOString().substring(0, 10),
          runtime: json.movie.runtime,
          mpaa_rating: json.movie.mpaa_rating,
          rating: json.movie.rating,
          description: json.movie.description,
        },
        isLoaded: true,
      },
        (error) => {
          this.setState({ isLoaded: true, error });
        })

      return
    }
    this.setState({ isLoaded: true });
  }
  confirmDelete = (e) => {
    e.preventDefault();
    confirmAlert({
      title: 'Delete Movie?',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            const data = await fetch(`http://localhost:4000/v1/admin/editmovie/${this.state.movie.id}`, {method: "DELETE"})
            const json = await data.json();
            if  (json.error) {
              this.setState({
                alert: { type: "alert-danger", message: json.error.message }
              })
              return
            }
            this.props.history.push({
              pathname: '/admin',
            })
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }
  render() {
    let { movie, isLoaded, error, alert } = this.state;
    console.log(movie)
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    return (
      <React.Fragment>
        <h2>Add/Edit Movie</h2>
        <Alert alertType={alert.type} message={alert.message} />
        <hr />
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" id="id" value={movie.id} onChange={this.handleChange} />
          <Input type="text" title="Title" name="title" value={movie.title} handleChange={this.handleChange}
            className={this.hasError("title") ? "is-invalid" : ""}
            errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
            errorMsg="Title is required"
          />
          <Input type="date" title="Release Date" name="release_date" value={movie.release_date} handleChange={this.handleChange} />
          <Input type="text" title="Runtime" name="runtime" value={movie.runtime} handleChange={this.handleChange} />
          {/* <Input  type="text" title="MPAA Rating" name="mpaa_rating" value={movie.mpaa_rating} handleChange={this.handleChange} /> */}
          <Select title="MPAA Rating" name="mpaa_rating" options={this.state.mpaaOptions} value={movie.mpaa_rating} placeholder="Choose..." handleChange={this.handleChange} />
          <Input type="text" title="Rating" name="rating" value={movie.rating} handleChange={this.handleChange} />
          <TextArea title="Description" name="description" value={movie.description} handleChange={this.handleChange} />
          <hr></hr>
          <button className="btn btn-primary">Save</button>
          <Link to="/admin" className="btn btn-warning ms-1">Cancel</Link>
          {movie.id > 0 && <button className="btn btn-danger ms-1" onClick={this.confirmDelete}>Delete</button>}
        </form>
      </React.Fragment>
    )
  }
}