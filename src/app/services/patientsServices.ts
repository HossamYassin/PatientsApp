import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<any[]>(this.apiUrl);
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${patient.id}`, patient);
  }

  deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${patientId}`);
  }

  getAppointments(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiAppointemntsUrl}/patient/${patientId}`
    );
  }
}
