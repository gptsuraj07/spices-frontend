import { Component, OnInit } from '@angular/core';
import { Combo } from '../../core/models';
import { ComboService } from '../../core/services/combo.service';

@Component({
  selector: 'app-admin-combos',
  standalone: false,
  template: `
    <div class="admin-combos">
      <h1 style="font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem;">Combos & Gift Boxes</h1>
      <div style="background: white; border-radius: 0.75rem; border: 1px solid #E5E7EB; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
            <tr>
              <th style="padding: 0.75rem 1rem; font-size: 0.875rem; color: #4B5563;">Combo Name</th>
              <th style="padding: 0.75rem 1rem; font-size: 0.875rem; color: #4B5563;">Price</th>
              <th style="padding: 0.75rem 1rem; font-size: 0.875rem; color: #4B5563;">Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of combos" style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 1rem; font-weight: 600;">{{ c.name }}</td>
              <td style="padding: 1rem; font-weight: 600;">₹{{ c.price }}</td>
              <td style="padding: 1rem; color: #047857; font-weight: 600;">Save ₹{{ c.savings }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminCombosComponent implements OnInit {
  combos: Combo[] = [];

  constructor(private comboService: ComboService) {}

  ngOnInit(): void {
    this.comboService.getAll().subscribe(res => {
      this.combos = res;
    });
  }
}
