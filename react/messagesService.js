import axios from "axios";
import * as serviceHelper from "./serviceHelpers";

const endpoint = `${serviceHelper.API_HOST_PREFIX}/api/messages`;

const getById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByCurrentUserId = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/current?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getBetween = (pageIndex, pageSize, anotherUserId) => {
  const config = {
    method: "GET",
    url: `${endpoint}/current/with/${anotherUserId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByCreatedBy = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/current/sent/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getMessagedWith = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/current/messagedwith`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByRecipientId = (recipientId) => {
  const config = {
    method: "GET",
    url: `${endpoint}/recipients/${recipientId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getBySenderId = (senderId) => {
  const config = {
    method: "GET",
    url: `${serviceHelper.API_HOST_PREFIX}/api/admin/messages/senders/${senderId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getBySenderIdRecipientId = (senderId, recipientId) => {
  const config = {
    method: "GET",
    url: `${serviceHelper.API_HOST_PREFIX}/api/admin/messages/senders/${senderId}/recipients/${recipientId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getMessagedUsersProfiles = () => {
  const config = {
    method: "GET",
    url: `${serviceHelper.API_HOST_PREFIX}/api/users/profiles/recipients`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};
const getVendersProfiles = () => {
  const config = {
    method: "GET",
    url: `${serviceHelper.API_HOST_PREFIX}/api/users/profiles/vendors`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};
const add = (payload) => {
  const config = {
    method: "POST",
    url: endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const deleteMessage = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

export {
  getById,
  getAll,
  getByCurrentUserId,
  getByCreatedBy,
  getBetween,
  getByRecipientId,
  getMessagedWith,
  getBySenderId,
  getBySenderIdRecipientId,
  getMessagedUsersProfiles,
  getVendersProfiles,
  add,
  deleteMessage,
  update,
};
