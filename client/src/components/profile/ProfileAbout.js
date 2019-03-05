import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // find the first name
    const firstName = profile.user.name.split(" ")[0];

    // skills list
    const skills = profile.skills.map((skill, ind) => (
      <div key={ind} className="p-3">
        <i className="fa fa-check" />
        {" " + skill}
      </div>
    ));

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="card card-body bg-light mb-3">
              <h3 className="text-center text-info">{firstName}'s Bio</h3>
              {isEmpty(profile.bio) ? (
                <p className="lead">{firstName + " doesn't have a bio"}</p>
              ) : (
                <p className="lead">{profile.bio}</p>
              )}
              <hr />
              <h3 className="text-center text-info">Skill Set</h3>
              <div className="row">
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                  {skills}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
