import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment.prod';
import { catchError, Observable, retry } from 'rxjs';
import { CountryEnvironmentalData, GetPlantFlagDto, Plant } from '../../interfaces/dasboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private API_URL = environment;
  
  getPlants(): Observable<GetPlantFlagDto[]> {
    return this.http.get<GetPlantFlagDto[]>(this.API_URL.services.getPlants);
  }
  getAllMetrics(): Observable<CountryEnvironmentalData> {
    return this.http.get<CountryEnvironmentalData>(this.API_URL.services.getMetrics).pipe(
    );
  }
  createPlant(plant:Plant): Observable<Plant>{
    return this.http.post<Plant>(this.API_URL.services.postPlant, plant);
  }
}
