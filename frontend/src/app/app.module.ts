import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardIcon } from './components/icons/clipboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    CardComponent,
    CheckoutComponent,
    ClipboardIcon,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
