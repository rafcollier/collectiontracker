import { Component, OnInit } from '@angular/core';
//NOTE this was imported manually
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  itemBrand: String;
  itemModel: String;
  itemDescription: String;
  itemImageURL: String;
  username: String;

  constructor(
      private validateService: ValidateService, 
      private flashMessage: FlashMessagesService,
      private authService: AuthService,
      private router: Router
  	) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      },
      err => {
        console.log(err);
        return false;
    });
  }

  onItemSubmit(){

    const item = {
      itemBrand: this.itemBrand,
      itemModel: this.itemModel,
      itemDescription: this.itemDescription,
      itemImageURL: this.itemImageURL,
      itemUserName: this.username
    }

    //Required fields
    if(!this.validateService.validateItem(item)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //Check success of write to database
    console.log("Calling auth service to add new item");
    this.authService.submitItem(item).subscribe(data => {
      console.log("Back in the front-end after adding a new item");
      this.itemBrand = "";
      this.itemModel = "";
      this.itemDescription = "";
      this.itemImageURL = "";

      if(data.success){
        this.flashMessage.show('Yeah, it worked!', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/items']); 
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/items']); 
        return false;
      }
    });

  }
}
