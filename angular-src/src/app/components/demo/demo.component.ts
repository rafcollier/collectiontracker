import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  items: [Object];
  username: string;
  itemsPerPage: number = 10; 
  offset: number = 0;
  searchParameter: string = "dateLastWorn";
  itemID: String;
  wornDatesStrings: [String];

  constructor(
      private authService: AuthService,
      private router: Router
  ) { }

 ngOnInit() {
   this.username = "demo";
   this.getItems();
  }

 getItems() {
   this.authService.getAllItems(this.username, this.offset, this.itemsPerPage, this.searchParameter).subscribe(entries => {
     this.items = entries; 
   }, 
   err => {
     console.log(err);
     return false;
   });
 }

 onWearTodaySubmit(item, index){
   this.itemID = item["_id"];
   this.authService.getOneItem(this.itemID).subscribe(entries => {
     this.wornDatesStrings = entries["dateWornString"].reverse();
    },
    err => {
      console.log(err);
      return false;
    });

  const today = moment();
  const dateString = today.format('MMMM DD, YYYY');
  const updateWornToday = {
    itemID: this.itemID, 
    wornDate: today,
    wornDateString: dateString 
  }

  this.authService.putWornToday(updateWornToday).subscribe(entries => {
    this.ngOnInit();
  },
  err => {
    console.log(err);
    return false;
  });

 }

  onItemClick(item, index) {
    const itemID = item["_id"]; 
    this.router.navigate(['/details', itemID]);
  }

}

