import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  items: [Object];
  length: number;
  offset: number = 0;
  username: string;
  itemsPerPage: number = 10; 
  numPages: number;
  currentPage: number = 1;
  indexPages: number[] = []; 
  searchParameter: string = "dateLastWorn";
  itemID: String;
  wornDatesStrings: [String];

  constructor(
      private flashMessage: FlashMessagesService,
      private authService: AuthService,
      private router: Router
  ) { }

 ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.getLength();
    }, 
    err => {
        console.log(err);
        return false;
    });
  }

  getLength() {
    this.authService.getCollectionLength(this.username).subscribe(entries => {
      this.length = entries; 
      this.numPages = Math.ceil(this.length / this.itemsPerPage);
      for(let i = 0; i < this.numPages; i++) {
        this.indexPages.push(i+1);
      }
      this.getItems();
    }, 
    err => {
        console.log(err);
        return false;
    });
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

  onNextClick() {
    if(this.currentPage < this.numPages){
      this.currentPage += 1;
      this.offset += this.itemsPerPage;
      this.getItems();
    }
  }

  onPreviousClick() {
    if(this.currentPage > 1){
      this.currentPage -= 1;
      this.offset -= this.itemsPerPage;
      this.getItems();
    }
  }

}
