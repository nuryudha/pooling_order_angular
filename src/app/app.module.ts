import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './../app/material/material.module';
import { HttpClientModule} from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { PoolingOrderComponent } from './pages/pooling-order/pooling-order.component';
import { DetailOrderComponent } from './pages/detail-order/detail-order.component';
import { InternalSalesComponent } from './pages/internal-sales/internal-sales.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AuthCheckComponent } from './pages/auth-check/auth-check.component';

@NgModule({
  declarations: [
    AppComponent,
    PoolingOrderComponent,
    DetailOrderComponent,
    InternalSalesComponent,
    PageNotFoundComponent,
    UnauthorizedComponent,
    AuthCheckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgxSpinnerModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
