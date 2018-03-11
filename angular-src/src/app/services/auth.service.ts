import { Injectable } from '@angular/core';

//NOTE -- imported manually
import{Http, Headers, URLSearchParams, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;
  items: any;
  title: any;

  //inject http into constructor
  constructor(private http: Http) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //return this.http.post('http://localhost:3000/users/register', user, {headers: headers}) //for local development
    return this.http.post('users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/authenticate', user, {headers: headers}) //add this for local dev: http://localhost:3000/
    //return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers}) //add this for local dev: http://localhost:3000/
      .map(res => res.json());
  }

  getProfile() {
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('users/profile', {headers: headers}) //add this for local dev: http://localhost:3000/
   // return this.http.get('http://localhost:3000/users/profile', {headers: headers}) //add this for local dev: http://localhost:3000/
      .map(res => res.json());
  } 

  getCollectionLength(username) {
    let headers = new Headers();
    let params = new URLSearchParams();
    let options = new RequestOptions();
    headers.append('Content-Type', 'application/json');
    params.set('itemUserName', username);
    options.headers = headers;
    options.search = params;
    //return this.http.get('http://localhost:3000/items/collectionLength', options) //add this for local dev: http://localhost:3000/
    return this.http.get('items/collectionLength', options) //add this for local dev: http://localhost:3000/
      .map(res => res.json());
  } 

  submitItem(item) {
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    //return this.http.post('http://localhost:3000/items/items', item, {headers: headers}) //for local development
    return this.http.post('items/items', item, {headers: headers}) //for local development
      .map(res => res.json());
  }
  
  getAllItems(username, itemOffset, limit, searchParameter) {
    let headers = new Headers();
    let params = new URLSearchParams();
    let options = new RequestOptions();
    headers.append('Content-Type', 'application/json');
    params.set('itemUserName', username);
    params.set('itemOffset', itemOffset);
    params.set('limit', limit);
    params.set('searchParameter', searchParameter);
    options.headers = headers;
    options.search = params;
    //return this.http.get('http://localhost:3000/items/getAllItems', options) //add this for local dev: http://localhost:3000/
    return this.http.get('items/getAllItems', options) //add this for local dev: http://localhost:3000/
      .map(res => res.json());
  } 

  getOneItem(itemID) {
    let headers = new Headers();
    let params = new URLSearchParams();
    let options = new RequestOptions();
    headers.append('Content-Type', 'application/json');
    params.set('itemID', itemID);
    options.headers = headers;
    options.search = params;
    //return this.http.get('http://localhost:3000/items/getOneItem', options)
    return this.http.get('items/getOneItem', options)
      .map(res => res.json());
  }

   deleteOneItem(itemID) {
    let headers = new Headers();
    let params = new URLSearchParams();
    let options = new RequestOptions();
    headers.append('Content-Type', 'application/json');
    params.set('itemID', itemID);
    options.headers = headers;
    options.search = params;
    //return this.http.delete('http://localhost:3000/items/deleteOneItem', options)
    return this.http.delete('items/deleteOneItem', options)
      .map(res => res.json());
  }

  putWornToday(updateWornToday) {
    let body = JSON.stringify(updateWornToday);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions();
    options.headers = headers;
    //return this.http.put('http://localhost:3000/items/updateWornToday', body, options) //add this for local dev: http://localhost:3000/
    return this.http.put('items/updateWornToday', body, options) //add this for local dev: http://localhost:3000/
      .map(res => res.json());
  } 

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user)); //local storage can only store strings, not objects
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loadUser(){
    const user = localStorage.getItem('user');
    return user;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn() {
    //return tokenNotExpired('id_token'); //may need this now
    return tokenNotExpired();
}


}
