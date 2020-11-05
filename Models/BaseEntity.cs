using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Tazkr.Controllers;

namespace Tazkr.Models
{
    public class BaseEntity { 
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public BaseEntity()
        {}
        public BaseEntity(BaseEntity copy)
        {
            this.CreatedDate = copy.CreatedDate;
            this.UpdatedDate = copy.UpdatedDate;
        }
    }
}

