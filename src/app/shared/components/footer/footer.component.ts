import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  categories: Category[] = [];
  newsletterForm: FormGroup;
  submitted = false;
  year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.categoryService.getActive().subscribe(cats => {
      this.categories = cats;
    });
  }

  onNewsletterSubmit(): void {
    if (this.newsletterForm.valid) {
      this.submitted = true;
      // TODO: POST /api/newsletter/subscribe
    }
  }
}
