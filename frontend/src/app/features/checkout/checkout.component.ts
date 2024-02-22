import { Component, ElementRef, ViewChild } from '@angular/core';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { Subscription, from } from 'rxjs';
import {
  PurchaseItem,
  StripeService,
} from '../../shared/services/stripe.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  private purchase: PurchaseItem[] = [
    { id: '1', name: 't-shirt', price: 1999 },
    { id: '2', name: 'shoes', price: 4999 },
  ];
  public totalAmount = 10998;
  public shippingFee = 1099;

  public copyText: string = 'Copy';

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;

  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public loading: boolean = false;

  private stripeSubscription = new Subscription();

  @ViewChild('cardInfo') cardInfo!: ElementRef;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cardNumber') cardNumber!: ElementRef;

  constructor(private stripeService: StripeService) {}

  ngOnInit() {
    this.stripeSubscription.add(
      this.stripeService.stripe.subscribe((_stripe) => {
        this.stripe = _stripe;
        if (!this.stripe) return;
        this.elements = this.stripe.elements();
        this.createCardElement();
      })
    );
  }

  ngOnDestroy() {
    this.stripeSubscription.unsubscribe();
  }

  private createCardElement() {
    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
      },
    };

    this.card = this.elements!.create('card', { style });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.on('change', (event) => {
      this.errorMessage = null;
    });
  }

  handleFormSubmit($event: Event) {
    $event.preventDefault();
    this.loading = true;
    this.stripeSubscription.add(
      this.stripeService
        .sendPaymentDetails(this.purchase, this.totalAmount, this.shippingFee)
        .subscribe({
          next: (data) => this.completePayment(data.clientSecret),
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Payment Failed';
          },
        })
    );
  }

  completePayment(clientSecret: string) {
    if (!this.stripe || !this.card) {
      console.error(
        'Stripe.js has not been loaded or Card element is not initialized'
      );
      return;
    }

    this.stripeSubscription.add(
      from(
        this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
          },
        })
      ).subscribe((result) => {
        if (result.error) {
          console.error('Error:', result.error.message);
          this.errorMessage = result.error.message!;
          this.loading = false;
        } else {
          console.log('Payment successful!');
          this.successMessage = 'Payment successful!';
          this.loading = false;
        }
      })
    );
  }

  copyCardNumber() {
    const cardNumber = this.cardNumber.nativeElement.innerText;
    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(cardNumber);
        this.copyText = 'Copied!';
        setTimeout(() => {
          this.copyText = 'Copy';
        }, 2000);
      } catch (err) {
        this.copyText = 'Copy';
      }
    };
    copyContent();
  }
}
