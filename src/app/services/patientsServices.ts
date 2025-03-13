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
import { ApiResponse } from '../models/ApiResponse';
import { Appointment } from '../models/Appointment';
import { Patient } from '../models/Patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;
  private apiAppointemntsUrl = `${environment.apiUrl}/appointments`;
  private http = inject(HttpClient);

  getPatients(): Observable<ApiResponse<Patient[]>> {
    return this.http.get<ApiResponse<Patient[]>>(this.apiUrl).pipe(
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

  addPatient(patient: Patient): Observable<ApiResponse<Patient>> {
    return this.http.post<ApiResponse<Patient>>(this.apiUrl, patient).pipe(
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

  updatePatient(patient: Patient): Observable<ApiResponse<Patient>> {
    return this.http
      .put<ApiResponse<Patient>>(`${this.apiUrl}/${patient.id}`, patient)
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

  deletePatient(patientId: number): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/${patientId}`)
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

  getAppointments(patientId: number): Observable<ApiResponse<Appointment[]>> {
    return this.http
      .get<ApiResponse<Appointment[]>>(
        `${this.apiAppointemntsUrl}/patient/${patientId}`
      )
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
