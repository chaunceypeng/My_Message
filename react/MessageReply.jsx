import React, { Component } from "react";
import { toast } from "react-toastify";
import debug from "sabio-debug";
import * as messagesService from "../../services/messagesService";

const _logger = debug.extend("MessageReply");

class MessageReply extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recipientId: props.location.state.user.userId,
			recipient: props.location.state.user.name,
			subject: props.location.state.message.subject,
			content: props.location.state.message.content,
		};
	}

	componentDidMount = () => {
		_logger("In MessageReply.jsx. componentDidMount");
	};

	handleCancel = (e) => {
		this.props.history.push("/Messages");
	};

	handleChange = (e) => {
		let content = e.target.value;
		this.setState(() => {
			return { content };
		});
	};

	handleSend = (e) => {
		e.preventDefault();
		_logger("Message sent.");
		let payload = {
			RecipientId: parseInt(this.state.recipientId),
			Subject: this.state.subject,
			Content: this.state.content,
		};
		messagesService
			.add(payload)
			.then(this.onAddMessageSuccess)
			.catch(this.onAddMessageError);
	};

	onAddMessageSuccess = (response) => {
		_logger("replyed.", response);
		toast.success("Message sent !", {
			position: toast.POSITION.TOP_RIGHT,
		});
		this.props.history.push(`/messages`, this.state);
	};

	onAddMessageError = (response) => {
		_logger(response);
	};

	render() {
		return (
			<React.Fragment>
				<div
					className="container-fluid"
					style={{ alignItems: "center", width: "70%" }}
				>
					<div className="card">
						<div className="card-header">
							<h5>Reply</h5>
						</div>
						<div className="card-body">
							<form className="theme-form">
								<div className="form-group">
									<label className="col-form-label pt-0">Recipient</label>
									<input
										className="form-control"
										aria-describedby="recipientIdHelp"
										type="text"
										value={this.state.recipient}
										readOnly
									></input>
								</div>
								<div className="form-group">
									<label className="col-form-label pt-0">Subject</label>
									<input
										className="form-control"
										name="subject"
										type="text"
										value={this.state.subject}
										readOnly
									></input>
								</div>
								<div className="form-group">
									<label htmlFor="content">Content</label>
									<textarea
										className="form-control"
										name="content"
										type="text"
										defaultValue={this.state.content}
										rows={5}
										cols={50}
										onChange={this.handleChange}
									></textarea>
								</div>
								<div className="text-sm-right card-footer">
									<button
										className="btn btn-secondary"
										type="button"
										onClick={this.handleSend}
									>
										Send
									</button>{" "}
									<button
										className="btn btn-secondary"
										onClick={this.handleCancel}
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				);
			</React.Fragment>
		);
	}
}

export default MessageReply;
