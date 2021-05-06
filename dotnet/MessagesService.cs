using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Messages;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Text;

namespace Sabio.Services
{
    public class MessagesService : IMessagesService, IMessagesAdminService 
    {
        IDataProvider _dataProvider = null;  
        public MessagesService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        
        // Get by Id
        public Message Get(int id)
        {
            string procName = "[dbo].[Messages_SelectById]";
            Message message = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(storedProc: procName, 
                inputParamMapper: delegate(SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id",id);
                },
                singleRecordMapper: delegate(IDataReader dataReader, short set)
                {                    
                    message = new Message();
                    message = MapMessage(dataReader, out totalCount);
                }
                );
            return message;
        }

        // Get all by pagination
        public Paged<Message> GetAll(int pageIndex, int pageSize)  
        {
            string procName = "[dbo].[Messages_SelectAll]";
            List<Message> messages = null;
            Paged<Message> pagedMessages = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@pageIndex", pageIndex);
                    paramCollecton.AddWithValue("@pageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            if (messages != null)
            {
                pagedMessages = new Paged<Message>(messages, pageIndex, pageSize, totalCount);
            }

            return pagedMessages;
        }

        // Get by CreatedBy with pagination, the current user who send the message is the creater
        public Paged<Message> Get(int pageIndex, int pageSize, int currentUserId)
        {
            string procName = "[dbo].[Messages_Select_ByCreatedBy]";
            List<Message> messages = null;
            Paged<Message> pagedMessages = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@PageIndex", pageIndex);
                    paramCollecton.AddWithValue("@PageSize", pageSize);
                    paramCollecton.AddWithValue("@SenderId", currentUserId);
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            if (messages != null)
            {
                pagedMessages = new Paged<Message>(messages, pageIndex, pageSize, totalCount);
            }
            return pagedMessages;
        }

        public Paged<Message> GetBetween(int pageIndex, int pageSize, int currentUserId, int messagedUserId)
        {
            string procName = "[dbo].[Messages_Select_Between]";
            List<Message> messages = null;
            Paged<Message> pagedMessages = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@PageIndex", pageIndex);
                    paramCollecton.AddWithValue("@PageSize", pageSize);
                    paramCollecton.AddWithValue("@CurrentUserId", currentUserId);
                    paramCollecton.AddWithValue("@MessagedUserId",messagedUserId);
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            if (messages != null)
            {
                pagedMessages = new Paged<Message>(messages, pageIndex, pageSize, totalCount);
            }
            return pagedMessages;
        }


        public Paged<Message> GetByCurrentUserId(int pageIndex, int pageSize, int currentUserId)
        {
            string procName = "[dbo].[Messages_Select_ByCurrentUser]";
            List<Message> messages = null;
            Paged<Message> pagedMessages = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@PageIndex", pageIndex);
                    paramCollecton.AddWithValue("@PageSize", pageSize);
                    paramCollecton.AddWithValue("@UserId", currentUserId);
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            if (messages != null)
            {
                pagedMessages = new Paged<Message>(messages, pageIndex, pageSize, totalCount);
            }
            return pagedMessages;
        }

        public List<Message> GetBySenderId(int senderId)
        {
            string procName = "[dbo].[Messages_Select_BySender]";
            List<Message> messages = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@SenderId", senderId);
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            return messages;
        }            

        // Get by SenderId and RecipientId
        public List<Message> Get(int senderId, int recipientId)
        {
            string procName = "[dbo].[Messages_Select_BySenderRecipient]";
            List<Message> messages = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@SenderId", senderId);
                    paramCollecton.AddWithValue("@RecipientId", recipientId);
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            return messages;
        }

        // Get by RecipientId
        public List<Message> GetByRecipientId(int recipientId)
        {
            string procName = "[dbo].[Messages_Select_ByRece]";
            List<Message> messages = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollecton)
                {
                    paramCollecton.AddWithValue("@RecipientId", recipientId);                    
                },
                singleRecordMapper: delegate (IDataReader dataReader, short set)
                {
                    Message messageRecord = MapMessage(dataReader, out totalCount);
                    if (messages == null)
                    {
                        messages = new List<Message>();
                    }
                    messages.Add(messageRecord);
                });
            return messages;
        }

               

        public int Add(MessageAddRequest model, int currentUserId)
        {
            string procName = "[dbo].[Messages_Insert_V2]";
            int id = 0;
            _dataProvider.ExecuteNonQuery(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Message", model.Content);
                    paramCollection.AddWithValue("@Subject", model.Subject);
                    paramCollection.AddWithValue("@RecipientId", model.RecipientId);
                    paramCollection.AddWithValue("@SenderId", currentUserId);                   
                    
                    SqlParameter idParam = new SqlParameter("@Id", SqlDbType.Int);
                    idParam.Direction = ParameterDirection.Output;
                    paramCollection.Add(idParam);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object objId = returnCollection["@Id"].Value;
                    Int32.TryParse(objId.ToString(), out id);
                });
            return id;
        }
        public void Update(MessageUpdateRequest model) 
        {
            string procName = "[dbo].[Messages_Update_V2]";
            _dataProvider.ExecuteNonQuery(storedProc: procName,
                inputParamMapper: delegate(SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id",model.Id);
                    paramCollection.AddWithValue("@Message", model.Content);                                                               
                },
                returnParameters: null);
        } 
        public void Delete(int id)
        {
            string procName = "[dbo].[Messages_Delete]";
            _dataProvider.ExecuteNonQuery(storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", id);
                });
        }

        private Message MapMessage(IDataReader dataReader, out int totalCount)
        {
            Message message = new Message();
            int startingIndex = 0;
            totalCount = 0;
            message.Id = dataReader.GetSafeInt32(startingIndex++);
            message.Content = dataReader.GetSafeString(startingIndex++);
            message.Subject = dataReader.GetSafeString(startingIndex++);
            message.RecipientId = dataReader.GetSafeInt32(startingIndex++);
            message.SenderId = dataReader.GetSafeInt32(startingIndex++);
            message.DateSent = dataReader.GetSafeUtcDateTime(startingIndex++);
            message.DateRead = dataReader.GetSafeUtcDateTime(startingIndex++);            
            message.DateCreated = dataReader.GetSafeUtcDateTime(startingIndex++);
            message.DateModified = dataReader.GetSafeUtcDateTime(startingIndex++);           
          
            if (totalCount == 0 && startingIndex < dataReader.FieldCount)
            {
                totalCount = dataReader.GetSafeInt32(startingIndex++);
            }
            return message;
        }

        private int MapUserId(IDataReader dataReader)
        {
            int startingIndex = 0;
            int userId = dataReader.GetSafeInt32(startingIndex++);
            return userId;
        }
    }

}
