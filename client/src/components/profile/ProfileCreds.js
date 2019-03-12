import React, { Component } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expItems = experience.map(exp => (
      <li key={exp._id} className="list-group-item">
        <h4>{exp.company}</h4>
        <p>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> {" - "}
          {exp.current ? "Now" : <Moment format="DD/MM/YYYY">{exp.to}</Moment>}
        </p>
        <p>
          <strong>Position: </strong>
          {exp.title}
        </p>
        {isEmpty(exp.location) ? null : (
          <p>
            <strong>Location: </strong>
            {exp.location}
          </p>
        )}
        {isEmpty(exp.description) ? null : (
          <p>
            <strong>Description: </strong>
            {exp.description}
          </p>
        )}
      </li>
    ));

    const eduItems = education.map(edu => (
      <li key={edu._id} className="list-group-item">
        <h4>{edu.school}</h4>
        <p>
          <Moment format="DD/MM/YYYY">{edu.from}</Moment> {" - "}
          {edu.current ? "Now" : <Moment format="DD/MM/YYYY">{edu.to}</Moment>}
        </p>
        <p>
          <strong>Degree: </strong>
          {edu.degree}
        </p>
        <p>
          <strong>Field of Study: </strong>
          {edu.fieldofstudy}
        </p>
        {isEmpty(edu.description) ? null : (
          <p>
            <strong>Description: </strong>
            {edu.description}
          </p>
        )}
      </li>
    ));

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">
            {expItems[0] ? (
              expItems
            ) : (
              <li className="list-group-item">
                <h4>No experience</h4>
              </li>
            )}
          </ul>
        </div>

        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          <ul className="list-group">
            {eduItems[0] ? (
              eduItems
            ) : (
              <li className="list-group-item">
                <h4>No education</h4>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

ProfileCreds.propTypes = {
  experience: PropTypes.array,
  education: PropTypes.array
};

export default ProfileCreds;
