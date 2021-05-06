using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Messages;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageApiController : BaseApiController
    {
        private IMessagesService _service = null;
        private IAuthenticationService<int> _authService = null;

        public MessageApiController(IMessagesService service,
            ILogger<MessageApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Message>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Message message = _service.Get(id);
                if ( message == null )
                {
                    iCode = 404;
                    response = new ErrorResponse("App record not found.");
                }
                else
                {
                    response = new ItemResponse<Message> { Item = message };
                }
            }            
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic error: { ex.Message }");
            }
            return StatusCode(iCode, response);
        }
        
        [HttpGet("paginate")]
        public ActionResult< ItemResponse< Paged<Message> > > GetAll(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Paged<Message> paged = _service.GetAll(pageIndex, pageSize);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse< Paged<Message> > { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Message>>> GetByCurrentUserId(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Message> paged = _service.GetByCurrentUserId(pageIndex, pageSize, userId);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("current/with/{messagedUserId:int}")]
        public ActionResult<ItemResponse<Paged<Message>>> GetBetween(int pageIndex, int pageSize, int messagedUserId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<Message> paged = _service.GetBetween(pageIndex, pageSize, currentUserId, messagedUserId);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        [HttpGet("current/sent")]
        public ActionResult<ItemResponse<Paged<Message>>> GetByCreatedBy(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Message> paged = _service.Get(pageIndex, pageSize, userId);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }        

        [HttpGet("recipients/{recipientId:int}")]
        public ActionResult<ItemsResponse<Message>> GetByRecipientId(int recipientId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                List<Message> list = _service.GetByRecipientId(recipientId);
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Message> { Items = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(MessageAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();               
                int id = _service.Add(model, userId);   
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {               
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(MessageUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);               
            }
            return StatusCode(iCode, response);            
        }
    }
}

