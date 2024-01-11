import { Clothes } from './../shared/clothes';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import the HttpClient module
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClothesService {

  private readonly API = environment.API; // Define API endpoint

  constructor(private http: HttpClient) { } // Inject the HttpClient module


  getClothes() {
    return this.http.get<Clothes[]>(`${environment.API}listClothes.php`)
    .pipe(
      take(1)
    )
;
}
}
