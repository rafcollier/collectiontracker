import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    console.log("Validating registration form");
    if(user.username == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }

   validateItem(item){
    console.log("Validating item submission form");
    if(item.itemBrand == undefined || item.itemModel == undefined || item.itemDescription == undefined || item.itemImageURL == undefined) {
      return false;
    } else {
      return true;
    }
  }

}
