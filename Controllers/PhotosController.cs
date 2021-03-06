using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;

namespace vega.Controllers
{
    // /api/vehicle/1/photos
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IHostingEnvironment host;
        private readonly IVehicleRepository repository;
        private readonly IPhotoRepository photoRepository;
        private readonly IMapper mapper;
        private readonly IPhotoService photoService;
        private readonly PhotoSettings photoSettings;

        public PhotosController(IHostingEnvironment host, 
                                IVehicleRepository repository,
                                IPhotoRepository photoRepository, 
                                IMapper mapper, 
                                IOptionsSnapshot<PhotoSettings> options,
                                IPhotoService photoService)
        {
            this.photoSettings = options.Value;
            this.mapper = mapper;
            this.photoService = photoService;
            this.repository = repository;
            this.photoRepository = photoRepository;
            this.host = host;
        }

        [HttpPost]
        [RequestSizeLimit(100_000_000_000)]
        public async Task<IActionResult> Upload(int vehicleId, IFormFile file)
        {
            var vehicle = await repository.GetVehicle(vehicleId, includeRelated: false);
            if (vehicle == null)
                return NotFound();

            if (file == null) 
                return BadRequest("Null File");

            if (file.Length == 0)
                return BadRequest("Empty File");

            if (file.Length > photoSettings.MaxBytes)
                return BadRequest("Maximum File size exceeded");

            if (!photoSettings.IsSupported(file.FileName))
                return BadRequest("Invalid File Type");

            // path similar to c:/wwwroot/
            var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads");
            var photo = await this.photoService.UploadPhoto(vehicle, file, uploadsFolderPath);            

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }

        [HttpGet]
        public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
        {
            var photos = await photoRepository.GetPhotos(vehicleId);

            return Mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
        }




    }
}