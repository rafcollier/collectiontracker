import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {ValidateService} from '../../services/validate.service';
import { tokenNotExpired } from 'angular2-jwt';
import * as moment from 'moment';

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

    this.route.params.subscribe(params => {
      this.itemID = params['item'];
      }
    );

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

    const today = moment();
    const dateString = today.format('MMMM DD, YYYY');
    const updateWornToday = {
      itemID: this.itemID, 
      wornDate: today,
      wornDateString: dateString 
    }

    if(dateString == this.wornDatesStrings[0]) {
      if(this.username == "demo") {
        this.flashMessage.show('The demo allows you to "wear today" more than once', {cssClass: 'alert-warning', timeout: 3000});
      } else {  
        this.flashMessage.show('You already indicated you wore this today.', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }

    this.authService.putWornToday(updateWornToday).subscribe(entries => {
    },
    err => {
      console.log(err);
      return false;
    });
  
    if(this.username == "demo") {
      this.router.navigate(['/demo']);
    } else {
      this.router.navigate(['/collection']);
    }

  }

  onDeleteItemSubmit() {

    if(this.username == "demo") {
      this.flashMessage.show('You can only delete an item from your own collection.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.authService.deleteOneItem(this.itemID).subscribe(entries => {
    },
    err => {
      console.log(err);
      return false;
    });

    this.router.navigate(['/collection']);

  }



}
