import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }

  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment>
          {" - "}
          {exp.to ? <Moment format="YYYY/MM/DD">{exp.to}</Moment> : "Now"}
        </td>
        <td>{exp.description}</td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this, exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          {experience}
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  experience: PropTypes.arrayOf(PropTypes.object),
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);