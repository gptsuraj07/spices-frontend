import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { Product, Order, ORDER_STATUS_LABEL } from '../../core/models';

interface KpiCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  filterStatus?: string;
  filterPayment?: string;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  paymentStatus: string;
  date: string;
  items: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  orders:   Order[]   = [];
  loadingProducts = true;

  kpiCards: KpiCard[] = [];
  recentOrders: RecentOrder[] = [];

  /** Bar chart data — last 7 days revenue */
  chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  chartValues = [0, 0, 0, 0, 0, 0, 0];
  chartMax = 1000;

  lowStockProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(products => {
      this.products = products;
      this.lowStockProducts = products.filter(p => (p.stock ?? 10) <= 5);
      this.loadingProducts = false;
      this.updateKpis();
    });

    this.orderService.getAll().subscribe(orders => {
      this.orders = orders;
      this.processOrders(orders);
    });
  }

  private processOrders(orders: Order[]): void {
    this.recentOrders = orders.slice(0, 5).map(o => ({
      id:            o.id,
      orderNumber:   o.orderNumber,
      customer:      o.customer?.name || 'Guest Customer',
      total:         o.total ?? 0,
      status:        o.status,
      paymentStatus: o.payment?.status ?? o.paymentStatus ?? 'PENDING_VERIFICATION',
      date:          o.createdAt ?? new Date().toISOString(),
      items:         Array.isArray(o.items) ? o.items.length : 1,
    }));

    const totalRevenue = orders
      .filter(o => o.payment?.status === 'PAID' || (o as any).paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingCount  = orders.filter(o => o.payment?.status === 'PENDING_VERIFICATION' || (o as any).paymentStatus === 'pending').length;
    const pendingAmount = orders
      .filter(o => o.payment?.status === 'PENDING_VERIFICATION' || (o as any).paymentStatus === 'pending')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const processingCount = orders.filter(o => (o.status as string) === 'PROCESSING' || (o.status as string) === 'processing').length;
    const shippedCount    = orders.filter(o => (o.status as string) === 'SHIPPED'    || (o.status as string) === 'shipped').length;
    const deliveredCount  = orders.filter(o => (o.status as string) === 'DELIVERED'  || (o.status as string) === 'delivered').length;

    this.kpiCards = [
      {
        title: 'Total Orders',
        value: `${orders.length}`,
        change: orders.length > 0 ? 'Total placed' : 'No orders yet',
        changeType: 'up', icon: 'bag', color: 'blue',
        filterStatus: 'all',
      },
      {
        title: 'Pending Verification',
        value: `${pendingCount}`,
        change: `₹${pendingAmount.toLocaleString('en-IN')} pending`,
        changeType: pendingCount > 0 ? 'down' : 'neutral', icon: 'clock', color: 'red',
        filterPayment: 'PENDING_VERIFICATION',
      },
      {
        title: 'Processing',
        value: `${processingCount}`,
        change: processingCount > 0 ? 'Being packed' : 'None active',
        changeType: 'neutral', icon: 'package', color: 'amber',
        filterStatus: 'PROCESSING',
      },
      {
        title: 'Shipped',
        value: `${shippedCount}`,
        change: shippedCount > 0 ? 'In transit' : 'None shipped',
        changeType: 'neutral', icon: 'truck', color: 'purple',
        filterStatus: 'SHIPPED',
      },
      {
        title: 'Delivered',
        value: `${deliveredCount}`,
        change: `₹${totalRevenue.toLocaleString('en-IN')} collected`,
        changeType: 'up', icon: 'rupee', color: 'green',
        filterStatus: 'DELIVERED',
      },
    ];

    // Compute chart values based on day of week
    const dayMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
    const chartVals = [0, 0, 0, 0, 0, 0, 0];
    orders.forEach(o => {
      if (o.createdAt) {
        const d = new Date(o.createdAt);
        const dayIdx = dayMap[d.getDay()];
        if (dayIdx !== undefined) chartVals[dayIdx] += (o.total || 0);
      }
    });
    const maxVal = Math.max(...chartVals, 1000);
    this.chartValues = chartVals;
    this.chartMax = maxVal;
  }

  private updateKpis(): void {
    if (this.kpiCards.length === 0) {
      this.kpiCards = [
        { title: 'Total Revenue',    value: '₹0', change: '0 orders paid', changeType: 'neutral', icon: 'rupee',   color: 'green' },
        { title: 'Total Orders',     value: '0',  change: 'No orders yet', changeType: 'neutral', icon: 'bag',     color: 'blue' },
        { title: 'Active Products',  value: `${this.products.length}`, change: 'In catalog', changeType: 'neutral', icon: 'package', color: 'amber' },
        { title: 'Pending Payments', value: '0',  change: '₹0 pending', changeType: 'neutral', icon: 'clock',   color: 'red' },
      ];
    }
  }

  navigateToOrders(kpi: KpiCard): void {
    const qp: any = {};
    if (kpi.filterStatus)  qp['status']  = kpi.filterStatus;
    if (kpi.filterPayment) qp['payment'] = kpi.filterPayment;
    this.router.navigate(['/admin/orders'], { queryParams: qp });
  }

  getBarHeight(value: number): number {
    return Math.round((value / this.chartMax) * 100);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ORDER_PLACED:          'badge--amber',
      PAYMENT_VERIFICATION:  'badge--amber',
      PAYMENT_CONFIRMED:     'badge--green',
      PROCESSING:            'badge--blue',
      SHIPPED:               'badge--purple',
      OUT_FOR_DELIVERY:      'badge--purple',
      DELIVERED:             'badge--green',
      PAYMENT_FAILED:        'badge--red',
      CANCELLED:             'badge--red',
      // Legacy
      confirmed:  'badge--amber',
      processing: 'badge--blue',
      shipped:    'badge--purple',
      delivered:  'badge--green',
      cancelled:  'badge--red',
    };
    return map[status] ?? 'badge--gray';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }
}
