using System;
using System.Dynamic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    /// <summary>
    /// Base class for Tazkr EF entities
    /// </summary>
    public abstract class BaseEntity {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int UpdateHashCode { get; set; }
        public string UpdatedByUserId { get; set; }
        public BaseEntity()
        {
            this.Id = System.Guid.NewGuid().ToString();
        }
        public BaseEntity(BaseEntity copy)
        {
            this.Id = copy.Id;
            this.CreatedDate = copy.CreatedDate;
            this.UpdatedDate = copy.UpdatedDate;
            this.UpdatedByUserId = copy.UpdatedByUserId;
            this.UpdateHashCode = copy.UpdateHashCode;
        }
        
        /// <summary>
        /// Return a JSON friendly subset of this object to the client app
        /// Used to reduce the payload and avoid JSON encoding issues such as circular references
        /// </summary>
        abstract public dynamic GetServerResponsePayload(); 
    }
}

