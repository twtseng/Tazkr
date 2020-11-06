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
        /// <summary>
        /// Guid ID primary key
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }
        public DateTime CreatedDateUTC { get; set; }
        public DateTime UpdatedDateUTC { get; set; }
        /// <summary>
        /// Integer value that is changed every time entity is modified, used as "key" for React arrays
        /// </summary>
        public int UpdateHashCode { get; set; }
        /// <summary>
        /// Last user that updated this object
        /// </summary>
        public string UpdatedByUserId { get; set; }
        public BaseEntity()
        {
            this.Id = System.Guid.NewGuid().ToString();
        }
        public BaseEntity(BaseEntity copy)
        {
            this.Id = copy.Id;
            this.CreatedDateUTC = copy.CreatedDateUTC;
            this.UpdatedDateUTC = copy.UpdatedDateUTC;
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

