import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './features/checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'checkout',
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
