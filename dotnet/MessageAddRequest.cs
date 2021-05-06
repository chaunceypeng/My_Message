using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text;

namespace Sabio.Models.Requests.Messages
{
    public class MessageAddRequest
    {
		[Required]
		[StringLength(maximumLength: 1000, MinimumLength = 1)]
		public string Content { get; set; }

		[StringLength(maximumLength:100)]
		public string Subject { get; set; }

		[Required]
		[Range(1,Int32.MaxValue)]
		public int RecipientId { get; set; }
	}
}
