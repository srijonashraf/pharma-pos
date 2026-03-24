import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateOrderDto,
  CreateOrderResponse,
  OrderListItem,
  OrderDetail,
} from '../models/order.model';
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

  getOrders(date: string): Observable<ApiResponse<OrderListItem[]>> {
    const params = new HttpParams().set('date', date).set('limit', '100');
    return this.http.get<ApiResponse<OrderListItem[]>>(`${this.baseUrl}/orders`, { params });
  }

  getOrderById(id: string): Observable<OrderDetail> {
    return this.http.get<ApiResponse<OrderDetail>>(`${this.baseUrl}/orders/${id}`).pipe(
      map(res => res.data)
    );
  }
}
