import React from "react";

const SingleUserProfile = (props) => {
	const handleClickOnPeople = () => {
		props.onClick(props.user);
	};

	return (
		<React.Fragment>
			<div onClick={handleClickOnPeople}>
				<li className="clearfix ">
					<img
						src={props.user.avatarUrl}
						alt=""
						className="rounded-circle user-image"
					/>
					<div className="status-circle offline" />
					<div className="name">
						{props.user.firstName} {props.user.lastName}
					</div>
				</li>
			</div>
		</React.Fragment>
	);
};

export default SingleUserProfile;
