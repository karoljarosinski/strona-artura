import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MainPageService } from '../services/main-page';
import { ApiResponse, ProductItem } from '../../../../models/response';
import { MatTableModule } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';
import { catchError, concat, delay, of, toArray } from 'rxjs';

@Component({
  selector: 'app-main-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
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
    const keyWords = this.requestForm.get('keyWords')?.value?.split(',');
    const requests = keyWords?.map((word) =>
      this.mainPageService.sendRequest(word.trim(), +this.requestForm.controls.pages.value!).pipe(
        delay(2000),
        catchError((error) => {
          console.error(`Error fetching data for word "${word}":`, error);
          return of(null);
        }),
      ),
    );
    if (this.requestForm.valid) {
      concat(...requests!)
        .pipe(toArray())
        .subscribe((responses: (ApiResponse | null)[]) => {
          const product = responses
            .filter((response): response is ApiResponse => response !== null)
            .map((response) => response.data.searchProducts.products)
            .flat();
          this.dataSource.set(product);
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
  }
}
