import { Injectable } from '@angular/core';

@Injectable()
export class DashboardService {

  constructor() { }

  selectBox: any;
  startDate: any;
  endDate: any;

  setSelectBox(value){
    this.selectBox = value;
    //console.log("selecbox dashboard service updated");
  }

  setStartDate(value){
    this.startDate = value;
  }

  setEndDate(value){
    this.endDate = value;
  }

  getSelectBox(){
    return this.selectBox;
  }

  getStartDate(){
    return this.startDate;
  }

  getEndDate(){
    return this.endDate;
  }

}
