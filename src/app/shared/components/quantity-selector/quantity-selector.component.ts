import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-quantity-selector',
  standalone: false,
  template: `
    <div class="qty" [class.qty--disabled]="disabled" role="group" aria-label="Quantity selector">
      <button
        class="qty__btn"
        type="button"
        (click)="decrement()"
        [disabled]="disabled || control.value <= min"
        aria-label="Decrease quantity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <input
        class="qty__input"
        type="number"
        [formControl]="control"
        [min]="min"
        [max]="max"
        (blur)="onBlur()"
        aria-label="Quantity"
        inputmode="numeric"
      />

      <button
        class="qty__btn"
        type="button"
        (click)="increment()"
        [disabled]="disabled || control.value >= max"
        aria-label="Increase quantity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  `,
  styleUrls: ['./quantity-selector.component.scss'],
})
export class QuantitySelectorComponent implements OnInit {
  @Input() value = 1;
  @Input() min = 1;
  @Input() max = 99;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number>();

  control!: FormControl;

  ngOnInit(): void {
    this.control = new FormControl(this.value, [
      Validators.min(this.min),
      Validators.max(this.max),
    ]);
    this.control.valueChanges.subscribe(v => {
      const num = parseInt(v, 10);
      if (!isNaN(num) && num >= this.min && num <= this.max) {
        this.valueChange.emit(num);
      }
    });
  }

  increment(): void {
    if (this.control.value < this.max) {
      this.control.setValue(this.control.value + 1);
    }
  }

  decrement(): void {
    if (this.control.value > this.min) {
      this.control.setValue(this.control.value - 1);
    }
  }

  onBlur(): void {
    let v = parseInt(this.control.value, 10);
    if (isNaN(v) || v < this.min) v = this.min;
    if (v > this.max) v = this.max;
    this.control.setValue(v, { emitEvent: true });
  }
}
