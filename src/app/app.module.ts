import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { TruncatePipe } from './truncate.pipe';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

import { AppRoutingModule }     from './app-routing.module';
import { provideAuth, AuthHttp, AuthConfig }      from 'angular2-jwt';

import { MenuService } from './menu/menu.services';
import { HistoryInvoiceService } from './history-invoice/history-invoice.service';
import { UserHistoryService } from './user-history/user-history.service';
import { HistoryFavoriteService } from './history-favorite/history-favorite.service';

import { MenuDirective } from './menu/menu.directive';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { AdminService } from './admin/admin.service';
import { FacebookService } from 'ng2-facebook-sdk';
import { AppService } from './app.service';
import { AdStatisticDrinkService } from './ad-statistic-drink/ad-statistic-drink.service';

import { Ng2PaginationModule } from 'ng2-pagination';
import { ChartModule } from 'angular-highcharts';
import { RatingFoodComponent } from './rating-food/rating-food.component';
import { RatingServiceComponent } from './rating-service/rating-service.component';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';
import { StaffComponent } from './staff/staff.component';
import { ScanQRCodeComponent } from './scan-qrcode/scan-qrcode.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './data-filter/data-filter.pipe';
import { DataFilterModule } from './data-filter/data-filter.module';
import { CustomFormsModule } from 'ng2-validation';

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
    RatingFoodComponent,
    UserProfileComponent,
    RatingServiceComponent,
    GoogleSignInComponent,
    MenuDirective,
    StaffComponent,
    ScanQRCodeComponent,
    LoadingIndicatorComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule,
    DataTableModule,
    DataFilterModule,
    CustomFormsModule,
    ChartModule
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [ Http, RequestOptions ]
    },
    MenuService,
    UserAuthenticationService,
    FacebookService,
    HistoryInvoiceService,
    UserHistoryService,
    HistoryFavoriteService,
    UserProfileService,
    AdminService,
    AppService,
    AdStatisticDrinkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
