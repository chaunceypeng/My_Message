using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Messages
{
    public class MessageUpdateRequest : IModelIdentifier
    {
        public int Id { get; set; }

        [Required]
        [StringLength(maximumLength: 1000, MinimumLength = 1)]
        public string Content { get; set; }              
    }
}
