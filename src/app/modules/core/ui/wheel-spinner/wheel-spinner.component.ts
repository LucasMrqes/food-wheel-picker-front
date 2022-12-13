import { Component, ViewChild, ElementRef, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-wheel-spinner',
  templateUrl: './wheel-spinner.component.html',
  styleUrls: ['./wheel-spinner.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate({{targetAngle}}deg)' }), {params: {targetAngle: '0'}}),
      transition('default => rotated', animate('5000ms ease-out'))
  ])
]
})

export class WheelSpinnerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() options: string[];
  @Input() size: number;
  private eventsSubscription: Subscription;
  @Input() spinWheel: Observable<void>;

  @Output() pickedIndex: EventEmitter<number> = new EventEmitter<number>();
  @Output() wheelRotated: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  x_center: number;
  y_center: number;
  radius: number;

  state = 'default';
  result: number;
  resultAngle = 0;

  constructor() {}

  private ctx: CanvasRenderingContext2D;
  private ctxNotch: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.eventsSubscription = this.spinWheel.subscribe(() => this.animate());
  }

  ngOnChanges(): void {
    if (!this.ctx) {
      this.initCanvas();
    }
    this.drawWheel();
  }

  initCanvas(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.x_center = this.size / 2;
    this.y_center = this.size / 2;
    this.ctx.translate(this.x_center, this.y_center);
    this.radius = this.size / 2 - 10;
    this.ctx.font = "20px Arial";
    this.ctx.rotate(-Math.PI/2);
  }

  drawWheel(): void {
    // Clear canvas canvas
    this.ctx.clearRect(-this.x_center, -this.y_center, this.size, this.size);

    // Angle between each slice
    const ang: number =  2 * Math.PI/this.options.length;

    for (let i = 0; i < this.options.length; i++) {
      // Draw each slice
      this.ctx.beginPath();

      this.ctx.lineTo(this.radius*Math.cos(i*ang),this.radius*Math.sin(i*ang));
      this.ctx.arc(0, 0, this.radius, i*ang, (i+1)*ang);
      this.ctx.lineTo(0, 0);
      // Fill each option with a color
      switch(i%4) {
        case 0: {
           this.ctx.fillStyle = '#EA047E'
           break;
        }
        case 1: {
           this.ctx.fillStyle = '#FF6D28'
           break;
        }
        case 2: {
          this.ctx.fillStyle = '#FCE700'
          break;
        }
        case 3: {
          this.ctx.fillStyle = '#00F5FF'
          break;
        }
      }
      // If the number of options is odd, fill the last option with a color that is different from the first color
      // (to avoid having the same color twice in a row)
      if (i == this.options.length - 1 && this.options.length%2==1) {
        this.ctx.fillStyle = '#FF6D28'
      }
      this.ctx.fill();
    }

    // Write each option in the middle of each slice
    this.ctx.fillStyle = '#000000'
    for (let i = 0; i < this.options.length; i++) {
      this.ctx.rotate(2*ang/3);
      this.ctx.fillText(this.options[i], this.radius/4, 0);
      this.ctx.rotate(ang/3);
    }
  }


  animate(): void {
    // If the wheel is in the default state, rotate it and display the result
    if (this.state == 'default') {
      this.result = Math.floor(Math.random() * this.options.length);
      this.resultAngle = -(20*360 + this.result * 360 / this.options.length + 360 / this.options.length / 2);
      this.state = 'rotated';
      this.wheelRotated.emit(true);
      this.pickedIndex.emit(this.result);
    } else {
      this.state = 'default';
      this.wheelRotated.emit(false);
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
