import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../../../models/response';

@Injectable({
  providedIn: 'root',
})
export class MainPageService {
  private readonly apiUrl = '/api-test';
  private readonly http = inject(HttpClient);

  sendRequest(word: string, pages: number): Observable<ApiResponse> {
    const body = {
      operationName: 'SearchResults',
      variables: {
        lang: 'pl',
        currency: 'EUR',
        filters: {},
        search: word,
        page: pages,
      },
      query:
        'query SearchResults($search: String!, $country: String, $currency: String!, $lang: String!, $page: Int, $filters: SearchFilters) {\n  searchProducts(searchTerm: $search, country: $country, productConfig: {language: $lang, currency: $currency}, page: $page, filters: $filters) {\n    products {\n      id\n      title\n      brand\n      tags\n      related_items\n      prices {\n        country\n        price\n        currency\n        inCampaign\n        url\n        __typename\n      }\n      all_images {\n        medium\n        large\n        __typename\n      }\n      __typename\n    }\n    next {\n      country\n      page\n      __typename\n    }\n    __typename\n  }\n}\n',
    };

    return this.http.post<ApiResponse>(this.apiUrl, body);
  }
}
