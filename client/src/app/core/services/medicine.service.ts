import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicineDto, MedicineFilter } from '../models/medicine.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMedicines(filter: MedicineFilter): Observable<ApiResponse<MedicineDto[]>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<MedicineDto[]>>(`${this.baseUrl}/medicines`, { params });
  }
}
