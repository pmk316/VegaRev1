using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using vega.Core.Models;
using vega.Models;

namespace vega.Core
{
    public interface IPhotoService
    {
         Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath);
    }
}