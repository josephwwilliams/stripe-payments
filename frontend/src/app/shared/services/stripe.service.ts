import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Observable, from } from 'rxjs';
import { environment } from './../../../environments/environment.development';

export interface PurchaseItem {
  id: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripe$: Observable<Stripe | null> = from(
    loadStripe(environment.PUBLIC_STRIPE_KEY)
  );

  get stripe() {
    return this.stripe$;
  }

  constructor(private httpClient: HttpClient) {}

  sendPaymentDetails(
    purchase: PurchaseItem[],
    totalAmount: number,
    shippingFee: number
  ) {
    return this.httpClient.post<{ clientSecret: string }>(
      'http://localhost:5000/stripe',
      {
        purchase,
        totalAmount,
        shippingFee,
      }
    );
  }
}
