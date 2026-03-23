import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateOrderDto, CreateOrderResponse } from '../models/order.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createOrder(dto: CreateOrderDto): Observable<CreateOrderResponse> {
    return this.http.post<ApiResponse<CreateOrderResponse>>(`${this.baseUrl}/orders`, dto).pipe(
      map(res => res.data)
    );
  }
}
