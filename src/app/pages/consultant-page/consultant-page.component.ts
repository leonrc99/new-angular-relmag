import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TarotService } from '../../services/tarot.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-consultant-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './consultant-page.component.html',
  styleUrl: './consultant-page.component.scss',
})
export class ConsultantPageComponent implements OnInit {
  consultant: any = null;
  isLoading = true;
  appointmentForm: FormGroup;
  availableDates: string[] = [];
  availableTimes: string[] = [];
  availableEndTimes: string[] = [];
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private tarotService: TarotService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const consultantId = params['id'];
      this.loadConsultantDetails(consultantId);
    });
  }

  loadConsultantDetails(consultantId: string): void {
    this.isLoading = true;
    this.tarotService.getConsultantById(consultantId).subscribe({
      next: (data) => {
        this.consultant = data;
        this.populateAvailableDates();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tarólogo:', err);
        this.isLoading = false;
      },
    });
  }

  populateAvailableDates(): void {
    const dateSet = new Set<string>();
    this.consultant.availabilities.forEach((slot: any) => {
      if (slot.available) {
        const date = slot.dateTime.split('T')[0];
        dateSet.add(date);
      }
    });
    this.availableDates = Array.from(dateSet).sort();
  }

  onDateChange(event: Event): void {
    const selectedDate = (event.target as HTMLSelectElement).value;
    this.availableTimes = this.consultant.availabilities
      .filter(
        (slot: any) => slot.available && slot.dateTime.startsWith(selectedDate)
      )
      .map((slot: any) => slot.dateTime.split('T')[1].slice(0, 5));
    this.availableEndTimes = [];
    this.totalPrice = 0;
    this.appointmentForm.patchValue({ startTime: '', endTime: '' });
  }

  updateAvailableEndTimes(): void {
    const selectedTime = this.appointmentForm.get('startTime')?.value;
    const startIndex = this.availableTimes.indexOf(selectedTime);
    this.availableEndTimes = this.availableTimes.slice(startIndex + 1);
    this.totalPrice = 0;
    this.appointmentForm.patchValue({ endTime: '' });
  }

  updateTotalPrice(): void {
    const startTime = this.appointmentForm.get('startTime')?.value;
    const endTime = this.appointmentForm.get('endTime')?.value;

    if (startTime && endTime) {
      const startIndex = this.availableTimes.indexOf(startTime);
      const endIndex = this.availableTimes.indexOf(endTime);
      const duration = endIndex - startIndex;
      this.totalPrice = duration * this.consultant.price;
    }
  }

  calculateDurationInMinutes(): number {
    const startTime = this.appointmentForm.value.startTime.split(':');
    const endTime = this.appointmentForm.value.endTime.split(':');
    const startMinutes =
      parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10);
    const endMinutes = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10);
    return endMinutes - startMinutes;
  }

  scheduleAppointment(): void {
    if (this.appointmentForm.valid) {
      
      const appointmentData = {
        consultantId: this.consultant.id,
        dateTime: `${this.appointmentForm.value.date}T${this.appointmentForm.value.startTime}`,
        durationInMinutes: this.calculateDurationInMinutes(), // Calcular a duração com base em `startTime` e `endTime`
        totalPrice: this.totalPrice,
      };

      this.tarotService.createAppointment(appointmentData).subscribe({
        next: (paymentLink) => {
          window.location.href = paymentLink; // Redireciona para a página de pagamento
        },
        error: (err) => {
          console.error('Erro ao agendar consulta:', err);
          alert('Ocorreu um erro ao tentar agendar a consulta.');
        },
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}
