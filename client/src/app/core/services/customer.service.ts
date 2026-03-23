import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateCustomerDto, CustomerDto } from '../models/customer.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  addCustomer(dto: CreateCustomerDto): Observable<CustomerDto> {
    return this.http.post<ApiResponse<CustomerDto>>(`${this.baseUrl}/customers`, dto).pipe(
      map(res => res.data)
    );
  }

  getCustomers(search: string): Observable<ApiResponse<CustomerDto[]>> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ApiResponse<CustomerDto[]>>(`${this.baseUrl}/customers`, { params });
  }
}
