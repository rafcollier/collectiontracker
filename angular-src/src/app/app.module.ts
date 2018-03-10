import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

//NOTE -- had to import these services manually
import {ValidateService} from './services/validate.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
//import { DisplayallComponent } from './components/displayall/displayall.component';
//import { DummyComponent } from './components/dummy/dummy.component';
//import { SearchComponent } from './components/search/search.component';
import { AboutComponent } from './components/about/about.component';
//import { AlltitlesComponent } from './components/alltitles/alltitles.component';
import { ItemsComponent } from './components/items/items.component';
import { DetailsComponent } from './components/details/details.component';
import { CollectionComponent } from './components/collection/collection.component';
import { DemoComponent } from './components/demo/demo.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
 // {path: 'search', component: SearchComponent},
  {path: 'about', component: AboutComponent},
  //{path: 'search/:title', component: SearchComponent},
  //{path: 'dummy', component: DummyComponent},
  {path: 'login', component: LoginComponent},
  {path: 'demo', component: DemoComponent},
  //{path: 'displayall', component: DisplayallComponent},
  //{path: 'alltitles', component: AlltitlesComponent},
  {path: 'items', component: ItemsComponent, canActivate:[AuthGuard]},
  {path: 'details', component: DetailsComponent},
  {path: 'collection', component: CollectionComponent, canActivate:[AuthGuard]},
  {path: 'details/:item', component: DetailsComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    //DisplayallComponent,
    //DummyComponent,
    //SearchComponent,
    AboutComponent,
    //AlltitlesComponent,
    ItemsComponent,
    DetailsComponent,
    CollectionComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
