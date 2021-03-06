import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: [Object];
  length: number;
  offset: number = 0;
  username: string;
  itemsPerPage: number = 15; 
  numPages: number;
  currentPage: number = 1;
  indexPages: number[] = []; 
  searchParams: string[] = ["date worn" , "brand" , "model", "colour"]; 
  searchParameter: string = "dateLastWorn";

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

  onItemClick(item, index) {
    const itemID = item["_id"]; 
    this.router.navigate(['/details', itemID]);
  }

  onIndexClick(index) {
    this.currentPage = index +1;
    this.offset = this.itemsPerPage * index;
    this.getItems();
  }

  onNextClick() {
    console.log(this.currentPage);
    console.log(this.offset);
    if(this.currentPage < this.numPages){
      this.currentPage += 1;
      this.offset += this.itemsPerPage;
      this.getItems();
    }
  }

  onPreviousClick() {
    console.log(this.currentPage);
    console.log(this.offset);
    if(this.currentPage > 1){
      this.currentPage -= 1;
      this.offset -= this.itemsPerPage;
      this.getItems();
    }
  }

  onSortClick(searchParameter) {
    this.currentPage = 1;
    this.offset = 0;
    
    if(searchParameter == "brand") {
      this.searchParameter = "itemBrand";
    } else if (searchParameter == "colour") {
      this.searchParameter = "itemDescription";
    } else if (searchParameter == "model") {
      this.searchParameter = "itemModel";
    } else {
      this.searchParameter = "dateLastWorn";
    }
   
    console.log("in sort " + searchParameter);
    this.getItems();

  }

  setPage(page) {


  }

}
