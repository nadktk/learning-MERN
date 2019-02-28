import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.errors) {
  //     this.setState({ errors: nextProps.errors });
  //   }
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors && nextProps.errors !== prevState.errors) {
      return { errors: nextProps.errors };
    } else return null;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const { name, email, password, password2 } = this.state;
    const newUser = {
      name,
      email,
      password,
      password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { name, email, password, password2, errors } = this.state;

    return (
      <div className="register full-height">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Name"
                  name="name"
                  value={name}
                  error={errors.name}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  placeholder="Email address"
                  name="email"
                  type="email"
                  value={email}
                  error={errors.email}
                  onChange={this.onChange}
                  info="This site uses Gravatar so if you want a profile image, use
                  a Gravatar email"
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  error={errors.password}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  placeholder="Confirm password"
                  name="password2"
                  type="password"
                  value={password2}
                  error={errors.password2}
                  onChange={this.onChange}
                />
                <button type="submit" className="btn btn-info btn-block mt-4">
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
