import { Component, OnInit } from '@angular/core';
import { Combo } from '../../core/models';
import { ComboService } from '../../core/services/combo.service';

@Component({
  selector: 'app-admin-combos',
  standalone: false,
  template: `
    <div class="ap-page">
      <div class="ap-header">
        <div>
          <h1 class="adash__title">Combos & Gift Sets</h1>
          <p class="adash__subtitle">Manage curated South Indian spice combo boxes.</p>
        </div>
      </div>

      <div class="adm-card">
        <!-- Desktop Table View -->
        <div class="adm-table-wrap adm-table-wrap--desktop">
          <table class="adm-table">
            <thead>
              <tr>
                <th>Combo Name</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of combos">
                <td style="font-weight: 600; color: #2A160C;">{{ c.name }}</td>
                <td style="font-weight: 700;">₹{{ c.price }}</td>
                <td><span class="adm-badge badge--green">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards List View (< 768px) -->
        <div class="ap-mobile-cards-list">
          <div class="ap-mobile-card" *ngFor="let c of combos">
            <div class="ap-mobile-card__header">
              <div>
                <div class="ap-name">{{ c.name }}</div>
              </div>
              <span class="adm-badge badge--green">Active</span>
            </div>
            <div class="ap-mobile-card__footer">
              <span class="ap-price">₹{{ c.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../products/products.component.scss']
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
