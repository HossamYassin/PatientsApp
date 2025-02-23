import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  delay,
  Observable,
  retry,
  retryWhen,
  scan,
  throwError,
} from 'rxjs';
import { environment } from '../environments/environment';

export interface Patient {
  id: number;
  email: string;
  fullName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;
  private apiAppointemntsUrl = `${environment.apiUrl}/appointments`;
  private http = inject(HttpClient);

  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= 3) {
              throw error; // Stop retrying after 3 attempts
            }
            console.warn(`Retrying... Attempt ${retryCount + 1}`);
            return retryCount + 1;
          }, 0),
          delay(2000) // Wait 2 seconds before retrying
        )
      ),
      catchError(this.handleError)
    );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= 3) {
              throw error; // Stop retrying after 3 attempts
            }
            console.warn(`Retrying... Attempt ${retryCount + 1}`);
            return retryCount + 1;
          }, 0),
          delay(2000) // Wait 2 seconds before retrying
        )
      ),
      catchError(this.handleError)
    );
  }

  updatePatient(patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${patient.id}`, patient).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= 3) {
              throw error; // Stop retrying after 3 attempts
            }
            console.warn(`Retrying... Attempt ${retryCount + 1}`);
            return retryCount + 1;
          }, 0),
          delay(2000) // Wait 2 seconds before retrying
        )
      ),
      catchError(this.handleError)
    );
  }

  deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${patientId}`).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= 3) {
              throw error; // Stop retrying after 3 attempts
            }
            console.warn(`Retrying... Attempt ${retryCount + 1}`);
            return retryCount + 1;
          }, 0),
          delay(2000) // Wait 2 seconds before retrying
        )
      ),
      catchError(this.handleError)
    );
  }

  getAppointments(patientId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiAppointemntsUrl}/patient/${patientId}`)
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            scan((retryCount, error) => {
              if (retryCount >= 3) {
                throw error; // Stop retrying after 3 attempts
              }
              console.warn(`Retrying... Attempt ${retryCount + 1}`);
              return retryCount + 1;
            }, 0),
            delay(2000) // Wait 2 seconds before retrying
          )
        ),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(
      () => new Error('Something went wrong, please try again later.')
    );
  }
}
