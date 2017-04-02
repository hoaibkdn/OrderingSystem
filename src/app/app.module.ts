import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';


import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

import { AppRoutingModule }     from './app-routing.module';
import { provideAuth, AuthHttp, AuthConfig }      from 'angular2-jwt';


import { MenuService } from './menu/menu.services';
import { MenuDirective } from './menu/menu.directive';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';
import { FacebookService } from 'ng2-facebook-sdk';



import { Ng2PaginationModule } from 'ng2-pagination';
import { RatingFoodComponent } from './rating-food/rating-food.component';
import { RatingServiceComponent } from './rating-service/rating-service.component';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
}

@Directive({
  selector: 'input'
})

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuDirective,
    RatingFoodComponent,
    UserProfileComponent,
    RatingServiceComponent,
    GoogleSignInComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [ Http, RequestOptions ]
    },
    MenuService,
    UserAuthenticationService,
    FacebookService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
