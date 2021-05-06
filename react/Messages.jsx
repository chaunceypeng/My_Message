import React, { Component } from "react";
import debug from "sabio-debug";
import * as messagesService from "../../services/messagesService";
import SingleUserProfile from "./SingleUserProfile";
import SingleMessage from "./SingleMessage";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import en_US from "./en_US";

const _logger = debug.extend("Messages");

const textItemRender = (current, type, element) => {
	if (type === "prev") {
		return "Prev";
	}
	if (type === "next") {
		return "Next";
	}
	return element;
};

class Messages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usersList: [],
			mappedUsers: [],
			filteredUsers: [],
			mappedMessages: [],
			selectedUser: { UserId: 0, firstName: "", lastName: "" },
			current: 0,
			total: 0,
			pageIndex: 0,
			pageSize: 5,
		};
	}

	componentDidMount() {
		_logger("In Messages.jsx, componetDidMount");
		let currentUserId = this.props.currentUser.id;
		messagesService
			.getMessagedUsersProfiles(currentUserId)
			.then(this.onGetUserProfilesSuccess)
			.then(this.getVendersProfiles)
			.catch(this.onGetUserProfilesError);
	}

	onGetVendersProfilesError = (response) => {
		_logger(response);
	};

	onGetUserProfilesSuccess = (response) => {
		let usersList = response.items;
		_logger("Get senders and recipients' profiles successd.", usersList);
		let mappedUsers = usersList.map(this.mapUsersProfiles);
		let filteredUsers = mappedUsers;
		this.setState(() => {
			return {
				usersList,
				mappedUsers,
				filteredUsers,
			};
		});
	};

	onGetUserProfilesError = (response) => {
		_logger(response);
	};

	getVendersProfiles = () => {
		messagesService
			.getVendersProfiles()
			.then(this.onGetVendersProfilesSuccess)
			.catch(this.onGetVendersProfilesError);
	};

	onGetVendersProfilesSuccess = (response) => {
		_logger(response);
		let venders = response.items.filter(this.filterVenders);
		let usersList = this.state.usersList.concat(venders);
		let mappedUsers = usersList.map(this.mapUsersProfiles);
		let filteredUsers = mappedUsers;
		this.setState(() => {
			return { usersList, mappedUsers, filteredUsers };
		});
	};

	filterVenders = (vender) => {
		let usersList = this.state.usersList;
		let result = true;
		for (let i = 0; i < usersList.length; i++) {
			if (vender.userId === usersList[i].userId) {
				result = false;
				break;
			}
		}
		return result;
	};

	mapUsersProfiles = (userProfile) => {
		return (
			<SingleUserProfile
				user={userProfile}
				key={userProfile.userId}
				onClick={this.handleClickOnUser}
			/>
		);
	};

	mapMessages = (aMessage) => {
		let uId =
			aMessage.senderId === this.props.currentUser.id
				? aMessage.recipientId
				: aMessage.senderId;
		let users = this.state.usersList;
		const user = { userId: uId, name: "" };
		for (let i = 0; i < users.length; i++) {
			if (uId === users[i].userId) {
				user.name = users[i].firstName + " " + users[i].lastName;
				break;
			}
		}

		let reply = (message, user) => {
			let info = { message, user };
			_logger("In Messages.jsx", info);
			this.props.history.push(`/messages/${message.id}/reply/`, info);
		};

		return (
			<SingleMessage
				message={aMessage}
				key={aMessage.id}
				currentUserId={this.props.currentUser.id}
				user={user}
				reply={reply}
			/>
		);
	};

	handleClickOnUser = (user) => {
		_logger("Click on User.", user.firstName + " " + user.lastName);
		this.setState((prevState) => {
			return {
				...prevState,
				selectedUser: user,
			};
		});
		messagesService
			.getBetween(this.state.pageIndex, this.state.pageSize, user.userId)
			.then(this.onGetBetweenSuccess)
			.catch(this.onGetBetweenError);
	};

	onGetBetweenSuccess = (response) => {
		_logger(response);
		let totalCount = response.item.totalCount;
		let messages = response.item.pagedItems.map(this.mapMessages);

		this.setState((prevState) => {
			return {
				...prevState,
				mappedMessages: messages,
				total: totalCount,
			};
		});
	};
	onGetBetweenError = (response) => {
		_logger(response);
		this.setState((prevState) => {
			return {
				...prevState,
				mappedMessages: [],
				total: 0,
			};
		});
	};

	handleSearchChange = (e) => {
		let search = e.target.value.toLowerCase();
		let users = this.state.mappedUsers;
		let filteredUsers = users;
		_logger(search, users, filteredUsers);
		if (search === "") {
			this.setState(() => ({
				filteredUsers,
			}));
		} else {
			filteredUsers = users.filter((user) =>
				(user.props.user.firstName + " " + user.props.user.lastName)
					.toLowerCase()
					.includes(search.toLowerCase())
			);
			_logger("filteredUsers are :", filteredUsers);
			this.setState(() => {
				return { search, filteredUsers };
			});
		}
	};

	handleSent = (e) => {
		e.preventDefault();
		this.props.history.push(`/messages/sent/`);
	};

	handleNew = (e) => {
		e.preventDefault();
		let recipient = {
			recipientId: this.state.selectedUser.userId,
			recipientName:
				this.state.selectedUser.firstName +
				" " +
				this.state.selectedUser.lastName,
			usersList: this.state.usersList,
		};
		this.props.history.push(`/messages/add/`, recipient);
	};

	onPaginationChange = (page) => {
		this.setState((prevState) => {
			return {
				...prevState,
				current: page,
			};
		});
		messagesService
			.getBetween(page - 1, this.state.pageSize, this.state.selectedUser.userId)
			.then(this.onGetBetweenSuccess)
			.catch(this.onGetBetweenError);
	};

	render() {
		return (
			<React.Fragment>
				<div className="container-fluid">
					<div className="page-header">
						<div className="row">
							<div className="col-lg-6">
								<h3>Messages</h3>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div className="call-chat-sidebar col-sm-12">
							<div className="card">
								<div className="chat-body card-body">
									<div className="chat-box">
										<div className="chat-left-aside">
											<div className="people-list custom-scrollbar">
												<div className="search">
													<div className="form-group">
														<input
															placeholder="search"
															type="text"
															className="form-control"
															onChange={this.handleSearchChange}
														/>
														<i className="fa fa-search" />
													</div>
												</div>
												<ul className="list">{this.state.filteredUsers}</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="call-chat-body col">
							<div className="card">
								<div className="p-0 card-body">
									<div className="chat-box row">
										<div className="pr-0 chat-right-aside col">
											<div className="chat">
												<div className="chat-header clearfix">
													<div className="about">
														<div className="name">Messaged History</div>
													</div>
													<img
														src={this.state.selectedUser.avatarUrl}
														className="rounded-circle media"
														alt=""
													/>
													<ul className="list-inline float-left float-sm-right chat-menu-icons">
														<div className="btn-group nav-right col">
															<button
																className="btn btn-square btn-light float-left"
																type="button"
																name="new"
																onClick={this.handleNew}
															>
																New
															</button>
														</div>
													</ul>
												</div>
												<div className="chat-history chat-msg-box custom-scrollbar">
													{this.state.mappedMessages}
												</div>
												<div className="row justify-content-center">
													<div className="rc-pagination">
														<Pagination
															itemRender={textItemRender}
															onChange={this.onPaginationChange}
															showSizeChanger={true}
															current={this.state.current}
															total={this.state.total}
															pageIndex={this.state.pageIndex}
															pageSize={this.state.pageSize}
															locale={en_US}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Messages;
