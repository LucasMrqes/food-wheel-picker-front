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

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('notchCanvas', { static: true }) notchCanvas: ElementRef<HTMLCanvasElement>;


  xCenter: number;
  yCenter: number;
  xCenterNotch: number;
  yCenterNotch: number;
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
    if (!this.ctxNotch) {
      this.initNotchCanvas();
    }
    this.drawWheel();
    this.drawNotch();
  }

  initCanvas(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.xCenter = this.size / 2;
    this.yCenter = this.size / 2;
    this.ctx.translate(this.xCenter, this.yCenter);
    this.radius = this.size / 2 - 10;
    this.ctx.font = "20px Arial";
    this.ctx.rotate(-Math.PI/2);
  }

  initNotchCanvas(): void {
    this.ctxNotch = this.notchCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.xCenterNotch = this.size / 2;
    this.yCenterNotch = this.size / 2;
    this.ctxNotch.translate(this.xCenterNotch, this.yCenterNotch);
  }

  drawNotch(): void {
    this.ctxNotch.moveTo(-this.size/20,-this.size/2);
    this.ctxNotch.lineTo(0,-this.size/2+this.size/10);
    this.ctxNotch.lineTo(this.size/20,-this.size/2);
    this.ctxNotch.fillStyle = '#FFCC02'
    this.ctxNotch.fill();

  }

  drawWheel(): void {
    // Clear canvas canvas
    this.ctx.clearRect(-this.xCenter, -this.yCenter, this.size, this.size);

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
      if (i == this.options.length - 1 && this.options.length%4==1) {
        this.ctx.fillStyle = '#FF6D28'
      }
      this.ctx.fill();
    }

    // Write each option in the middle of each slice
    this.ctx.fillStyle = '#000000'
    const textStartingPointRatio = 2/7;
    for (let i = 0; i < this.options.length; i++) {
      this.ctx.rotate(ang/2);
      // Si le text est trop long, on écrit chaque ligne du texte l'une en dessous de l'autre
      this.getLines(this.ctx, this.options[i], this.radius*(1-textStartingPointRatio)).forEach((option, index, options) => {
        this.ctx.fillText(
          option,
          this.radius*textStartingPointRatio,
          -(options.length-1)*10 + 8 + 18*(index) // Réhaussement de 10 pixels par ligne de texte, réhaussement constant de 8 pour être au milieu de la slice, hauteur de ligne 18px
        );
      });
      this.ctx.rotate(ang/2);
    }
  }

  // Split un texte en plusieurs lignes s'il est trop long
  getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
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
