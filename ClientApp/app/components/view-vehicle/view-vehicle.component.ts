import { ProgressService } from './../../services/progress.service';
import { PhotoService } from './../../services/photo.service';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  vehicle: any;
  vehicleId: number;
  photos: any [];
  progress: null;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private progressService: ProgressService,
    private vehicleService: VehicleService,
    private photoService: PhotoService) {
      this.route.params.subscribe(p => {
        this.vehicleId = +p['id'];
        if (isNaN(this.vehicleId) || this.vehicleId <=0) {
          router.navigate(['/vehicles']);
          return;
        }
      });
  }

  ngOnInit() {

    this.photoService.getPhotos(this.vehicleId)
    .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(v => {
        this.vehicle = v;
      }, err => {
        if (err.status == 404) {
          this.router.navigate(['/vehicles']);
          return;
        }
      }
    );

  }

  delete() {
    if(confirm('Are You Sure?')) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles']);
        })
    }
  }

  uploadPhoto() {
    // this.photoService.upload(this.vehicleId, nativeElement.files[0])
    //   .subscribe(x => console.log(x));

    this.progressService.startTracking()
      .subscribe(progress => {
        console.log(progress);        
        this.zone.run(() => {
          this.progress = progress;  
        });
      }, 
      undefined,
      () => {
        this.progress = null;
      });

    var nativeElement: any = this.fileInput.nativeElement;
    var file = nativeElement.files[0];
    nativeElement.value = '';
    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => {
        this.photos.push(photo);
      },
      err => {
        nativeElement
        this.toasty.error({
          title: 'Error',
          msg: err.text(),
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
      });
  }

}
