import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MainPageService } from '../services/main-page';
import { ApiResponse, ProductItem } from '../../../../models/response';
import { MatTableModule } from '@angular/material/table';
import { JsonPipe } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-main-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    JsonPipe,
    MatSpinner,
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPage {
  displayedColumns: string[] = ['title', 'brand', 'prices'];
  dataSource: WritableSignal<ProductItem[]> = signal<ProductItem[]>([]);
  protected readonly filteredData: WritableSignal<ProductItem[]> = signal<ProductItem[]>([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly mainPageService = inject(MainPageService);
  requestForm = new FormGroup({
    keyWords: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pages: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
  });

  submit() {
    this.loading.set(true);
    if (this.requestForm.valid) {
      this.mainPageService
        .sendRequest(
          this.requestForm.controls.keyWords.value!,
          +this.requestForm.controls.pages.value!,
        )
        .subscribe((response: ApiResponse) => {
          this.dataSource.set(response.data.searchProducts.products);
          this.filterData();
          this.loading.set(false);
        });
    }
  }

  private filterData() {
    this.filteredData.set(
      this.dataSource().filter(
        (item) => item.prices[0].price / item.prices[item.prices.length - 1].price < 0.7,
      ),
    );
    console.log(this.filteredData());
  }
}
