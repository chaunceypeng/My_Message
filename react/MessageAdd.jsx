import React, { Component } from "react";
import { toast } from "react-toastify";
import debug from "sabio-debug";
import * as messagesService from "../../services/messagesService";
import { Form, FormGroup, Label, Button } from "reactstrap";
import { Formik, Field } from "formik";
import MessageSchema from "../../schemas/MessageSchema";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";

const _logger = debug.extend("MessageAdd");

class MessageAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: props.location.state.usersList,
      users: [],
      filteredUsers: [],
      recipientId: props.location.state.recipientId,
      recipientName: props.location.state.recipientName,
      formData: {
        subject: "",
        content: "",
      },
    };
  }

  componentDidMount = () => {
    _logger("MessageAdd mount.");
    let users = this.state.usersList.map(this.mapUsersProfiles);
    this.setState(() => {
      return { users };
    });
  };
  mapUsersProfiles = (userProfile) => {
    let id = userProfile.userId;
    let label = userProfile.firstName + " " + userProfile.lastName;
    let value = label;
    return { label, value, id };
  };

  filterUsers = (inputValue) => {
    _logger(inputValue);
    return this.state.users.filter((user) =>
      user.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  loadOptions = (inputValue, resolve) => {
    setTimeout(() => {
      resolve(this.filterUsers(inputValue));
    }, 1000);
  };

  handleSelect = (user) => {
    _logger(user);
    this.setState(() => {
      return { recipientId: user.id, recipientName: user.value };
    });
  };
  handleSend = (values) => {
    _logger(values);
    let payload = {
      RecipientId: this.state.recipientId,
      Subject: values.subject,
      Content: values.content,
    };
    messagesService
      .add(payload)
      .then(this.onAddMessageSuccess)
      .catch(this.onAddMessageError);

    this.props.history.push("/messages");
  };

  onAddMessageSuccess = (response) => {
    _logger(response);
    toast.success("Message sent !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  onAddMessageError = (response) => {
    _logger(response);
    toast.error("Error occurd, message not sent !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  handleCancel = () => {
    this.props.history.push("/messages");
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={this.state.formData}
          onSubmit={this.handleSend}
          validationSchema={MessageSchema}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              isValid,
              isSubmitting,
            } = props;
            return (
              <div
                className="container-fluid"
                style={{ alignItems: "center", width: "70%" }}
              >
                <div className="card">
                  <div className="card-header">
                    <h5>New Message</h5>
                  </div>
                  <div className="card-body">
                    <Form onSubmit={handleSubmit} className="theme-form">
                      <FormGroup>
                        <label className="col-form-label pt-0">Recipient</label>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          defaultInputValue={this.state.recipientName}
                          loadOptions={this.loadOptions}
                          onChange={this.handleSelect}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="subject">Subject</Label>
                        <Field
                          name="subject"
                          placeholder="Subject"
                          type="text"
                          value={values.subject}
                          autoComplete="off"
                          className={
                            errors.subject && touched.subject
                              ? "form-control is-invalid txt-dark"
                              : "form-control txt-dark"
                          }
                        />
                        {errors.subject && touched.subject && (
                          <span className="input-feedback">
                            {errors.subject}
                          </span>
                        )}
                        <small>--Subjuct is no more than 100 characters.</small>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="content">Content</Label>
                        <Field
                          name="content"
                          component="textarea"
                          placeholder="Your Message"
                          type="text"
                          value={values.content}
                          rows={5}
                          cols={50}
                          className={
                            errors.content && touched.content
                              ? "form-control is-invalid txt-dark"
                              : "form-control txt-dark"
                          }
                        />
                        {errors.content && touched.content && (
                          <span className="input-feedback">
                            {errors.content}
                          </span>
                        )}
                        <small>
                          --Content is no more than 1000 characters.
                        </small>
                      </FormGroup>
                      <div className="text-sm-right card-footer">
                        <Button
                          type="submit"
                          disabled={!isValid || isSubmitting}
                        >
                          Send
                        </Button>{" "}
                        <Button
                          className="btn btn-secondary"
                          onClick={this.handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}

MessageAdd.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      recipientId: PropTypes.number,
      recipientName: PropTypes.string,
      usersList: PropTypes.any,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default MessageAdd;
