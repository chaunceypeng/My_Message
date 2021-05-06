import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const SingleMessage = (props) => {
	const handleReply = () => {
		props.reply(props.message, props.user);
	};

	if (props.message.senderId === props.currentUserId) {
		return (
			<React.Fragment>
				<div className="card">
					<div className="card-body">
						<h6>{props.message.subject}</h6>
						<p>{props.message.content}</p>
						<Moment parse="YYYY-MM-DD HH:mm">
							Date:{props.message.dateSent}
						</Moment>
					</div>
				</div>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				<div className="card">
					<div className="card-body">
						<h6>{props.message.subject}</h6>
						<p>{props.message.content}</p>
						<Moment parse="YYYY-MM-DD HH:mm">
							Date:{props.message.dateSent}
						</Moment>
						<div className="action-wrapper">
							<span className="txt-primary" onClick={handleReply}>
								<i className="fa fa-reply mr-2" />
								Reply
							</span>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
};

SingleMessage.propTypes = {
	message: PropTypes.shape({
		subject: PropTypes.string,
		content: PropTypes.string.isRequired,
	}),
};

export default SingleMessage;
