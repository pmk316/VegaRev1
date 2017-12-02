import { AuthService } from './../../services/auth.service';
import { KeyValuePair } from './../../Models/Vehicle';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../Models/Vehicle';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  private readonly PAGE_SIZE = 3;

  queryResult: any = {};
  //allVehicles: Vehicle[];
  makes: KeyValuePair[];
  query: any = {
    pageSize : this.PAGE_SIZE
  };  
  columns = [
    {title: 'Id'},
    {title: 'Make', key: 'make', isSortable: true},
    {title: 'Model', key: 'model', isSortable: true},
    {title: 'ContactName', key: 'contactName', isSortable: true},
    {}
  ];

  constructor(private vehicleService : VehicleService,
              private authService: AuthService) { }

  ngOnInit() {

    this.vehicleService.getMakes()
      .subscribe( makes => {
        this.makes = makes;
      });

    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query)
    .subscribe( result => {
      //this.vehicles = this.allVehicles = vehicles;
      this.queryResult = result;
    });
  }

  onFilterChange() {
    //this.query.modelId = 3;
    this.query.page = 1;
    this.populateVehicles();

    // Use in case of client side filtering
    // var vehicles = this.allVehicles;

    // if(this.filter.makeId)
    //   vehicles = vehicles.filter(v => v.make.id == this.filter.makeId);

    // if(this.filter.modelId)
    //   vehicles = vehicles.filter(v => v.model.id == this.filter.modelId);

    // this.vehicles = vehicles;
  }

  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };

    this.populateVehicles();
  }

  sortBy(columnName : string) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }

  onPageChange(page : any) {
    console.log("Page Changed Event, page=" + page);
    this.query.page = page;
    this.populateVehicles();
  }

}
