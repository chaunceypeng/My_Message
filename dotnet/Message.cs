using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Message
    {		
		public int Id { get; set; }
		public string Content { get; set; }    
		public string Subject { get; set; }
		public int RecipientId { get; set; }
		public int SenderId { get; set; }
		public DateTime DateSent { get; set; }
		public DateTime DateRead { get; set; }
		public DateTime DateModified { get; set; }
		public DateTime DateCreated { get; set; }		
	}
}
