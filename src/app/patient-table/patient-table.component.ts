import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Patient, PatientService } from '../services/patientsServices';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
})
export class PatientTableComponent {
  patients: any[] = [];
  appointments: any[] = [];
  selectedPatient: any = null;
  patientForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  selectedPatientId: number | null = null;

  private patientService = inject(PatientService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);

  constructor() {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe((data) => {
      this.patients = data;
    });
  }

  openAppointmentsModal(content: any, patient: any) {
    this.selectedPatient = patient;
    this.patientService.getAppointments(patient.id).subscribe((data) => {
      this.appointments = data;
      this.modalService.open(content, {
        backdrop: 'static',
        keyboard: false,
      });
    });
  }
  openAddPatientModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  savePatient(modal: any): void {
    if (this.patientForm.invalid) return;

    const newPatient: Patient = this.patientForm.value;
    newPatient.id = 0;

    const rawDate: NgbDateStruct = this.patientForm.value.dateOfBirth;
    const formattedDate = this.convertDateToISO(rawDate);
    newPatient.dateOfBirth = formattedDate;

    this.patientService.addPatient(newPatient).subscribe(
      () => {
        Swal.fire('Success', 'Patient added successfully!', 'success');
        this.loadPatients();
        modal.close();
      },
      () => {
        Swal.fire('Error', 'Failed to add patient.', 'error');
      }
    );
  }

  openEditModal(content: any, patient: any) {
    this.selectedPatientId = patient.id;

    // Convert ISO date to NgbDateStruct
    const dob = new Date(patient.dateOfBirth);
    const ngbDate: NgbDateStruct = {
      year: dob.getFullYear(),
      month: dob.getMonth() + 1,
      day: dob.getDate(),
    };

    // Patch form with existing data
    this.patientForm.patchValue({
      fullName: patient.fullName,
      email: patient.email,
      dateOfBirth: ngbDate,
      street: patient.street,
      city: patient.city,
      state: patient.state,
      zipCode: patient.zipCode,
    });

    this.modalService.open(content, { centered: true });
  }

  updatePatient(modal: any) {
    if (this.patientForm.valid && this.selectedPatientId) {
      const formValue = this.patientForm.value;
      const updatedPatient = {
        id: this.selectedPatientId,
        fullName: formValue.fullName,
        email: formValue.email,
        dateOfBirth: this.convertDateToISO(formValue.dateOfBirth),
        street: formValue.street,
        city: formValue.city,
        state: formValue.state,
        zipCode: formValue.zipCode,
      };

      this.patientService.updatePatient(updatedPatient).subscribe(
        () => {
          Swal.fire('Success', 'Patient updated successfully!', 'success');
          this.loadPatients();
          modal.close();
        },
        () => {
          Swal.fire('Error', 'Failed to add patient.', 'error');
        }
      );
    }
  }

  confirmDelete(patientId: number, content: any): void {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deletePatient(patientId);
        }
      },
      (dismissed) => {}
    );
  }

  deletePatient(patientId: number): void {
    this.patientService.deletePatient(patientId).subscribe(() => {
      this.patients = this.patients.filter((p) => p.id !== patientId);
    });
  }

  convertDateToISO(ngbDate: NgbDateStruct): string {
    if (!ngbDate) return '';

    const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    return date.toISOString(); // Convert to ISO format
  }
}
