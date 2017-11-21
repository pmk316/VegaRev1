import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  @Input('total-items') totalItems = 10;
  @Input('page-size') pageSize = 2;
  @Output('page-changed') pageChanged = new EventEmitter();
  pages : any[];
  currentPage = 1;

  ngOnChanges(): void {
    this.currentPage = 1;

    var pagesCount = Math.ceil(this.totalItems/this.pageSize);
    this.pages = [];
    for(var i=1; i<=pagesCount; i++)
      this.pages.push(i);
    
      console.log(this);
  }

  changePage(page : any) {
    this.currentPage = page;
    this.pageChanged.emit(page);
  }

  previous() {
    if (this.currentPage == 1)
      return;
    
    this.currentPage--;
    this.pageChanged.emit(this.currentPage);
    console.log("previous", this);
  }

  next() {
    if (this.currentPage == this.pages.length)
      return;
    
    this.currentPage++;
    this.pageChanged.emit(this.currentPage);
    console.log("next", this);
  }

  constructor() { }


}
