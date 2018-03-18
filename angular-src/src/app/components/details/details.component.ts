import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {ValidateService} from '../../services/validate.service';
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

	private sub: any;
	itemID: String;
	oneItem: Object;
  wornDatesStrings: [String];
  wornBefore: Boolean = false;
  username: String;

  constructor(
  	private route: ActivatedRoute,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {

    console.log("Initializing the details page");

    this.route.params.subscribe(params => {
      this.itemID = params['item'];
      }
    );

    console.log("Calling auth sevice to get details on one item");
    this.authService.getOneItem(this.itemID).subscribe(entries => {
        this.oneItem = entries; 
        this.wornDatesStrings = entries["dateWornString"].reverse();
        this.username = entries["itemUserName"];

        if(this.wornDatesStrings.length > 0) {
          this.wornBefore = true;
        } 

      },
      err => {
        console.log(err);
        return false;
      });
  }

  onWearTodaySubmit(){

    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const dateString = monthNames[month] + " " + day + ", " + year; 

    if(dateString == this.wornDatesStrings[0]) {
      if(this.username == "demo") {
        this.flashMessage.show('The demo allows you to "wear today" more than once', {cssClass: 'alert-warning', timeout: 3000});
      } else {  
        this.flashMessage.show('You already indicated you wore this today.', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }

    const updateWornToday = {
      itemID: this.itemID,
      wornDate: today,
      wornDateString: dateString 
    }

    this.authService.putWornToday(updateWornToday).subscribe(entries => {
    },
    err => {
      console.log(err);
      return false;
    });

    this.ngOnInit();

  }

  onDeleteItemSubmit() {

    if(this.username == "demo") {
      this.flashMessage.show('You can only delete an item from your own collection.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    console.log("Calling auth service to delete one item with id: " + this.itemID);
    this.authService.deleteOneItem(this.itemID).subscribe(entries => {
    },
    err => {
      console.log(err);
      return false;
    });

    this.router.navigate(['/collection']);

  }



}
