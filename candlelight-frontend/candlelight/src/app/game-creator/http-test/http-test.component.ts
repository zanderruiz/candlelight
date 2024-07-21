import { Component, inject } from '@angular/core';
import { HeartbeatDataService } from '../../data/heartbeat/heartbeat-data.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';

interface ResponseInfo {
  value: string;
  error?: boolean;
}

@Component({
  selector: 'app-http-test',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './http-test.component.html',
  styleUrl: './http-test.component.css'
})
export class HttpTestComponent {
  private readonly heartbeatDataService: HeartbeatDataService = inject(HeartbeatDataService);

  readonly response = new BehaviorSubject<ResponseInfo>({ value: '' });

  readonly form: FormGroup = new FormGroup({
    testInput: new FormControl<string>('', { nonNullable: true })
  });

  send(): void {
    this.response.next({ value: '' });

    const input: string = this.form.getRawValue().testInput;
    const observer = {
      next: (s: string) => {
        this.response.next({ value: s });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.response.next({ value: err.error?.message || err.message, error: true });
      }
    };
    this.heartbeatDataService.post(input).subscribe(observer);
  }
}
