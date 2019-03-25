import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  items: [Object];
  displayItems: any [];
  length: number;
  offset: number = 0;
  username: string;
  itemsPerPage: number = 10000; 
  numPages: number;
  currentPage: number = 1;
  indexPages: number[] = []; 
  searchParams: string[] = ["Date" , "Brand" , "Model", "Colour"]; 
  searchParameter: string = "dateLastWorn";

  constructor(
      private flashMessage: FlashMessagesService,
      private authService: AuthService,
      private router: Router
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
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
      console.log(this.items);
  
      let historyArray = []; 
      for (let i = 0; i < this.items.length; i++) {
      	if(this.items[i]['dateWornString'].length > 0) {
          for(let j =0; j < this.items[i]['dateWornString'].length; j++) {
            historyArray.push({ 'url': this.items[i]['itemImageURL'], 'date': moment(this.items[i]['dateWornString'][j]) });
          }
      	}
      }
      console.log(historyArray);

      const historyArraySorted = historyArray.sort((a,b) => b['date'].format('YYYYMMDD') - a['date'].format('YYYYMMDD') );

      console.log(historyArraySorted);

      this.displayItems = historyArraySorted.map ( x => {
        x['date'] = x['date'].format('MMMM DD, YYYY');
        return {'url': x['url'], 'date': x['date']};
      });

      console.log(this.displayItems);

    }, 
    err => {
        console.log(err);
        return false;
    });
  }

}
