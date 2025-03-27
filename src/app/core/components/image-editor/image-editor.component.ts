import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-editor',
  imports: [CommonModule,FormsModule],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements OnInit, AfterViewInit{
  ngOnInit(): void {
  }
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  markers: { x: number; y: number; text: string }[] = [];
  annotationMode: 'text' | 'x-mark' = 'text';
  imageLoaded = false;

  ngAfterViewInit() {
    const img = this.imageElement.nativeElement;
    img.onload = () => {
      this.imageLoaded = true;
      const canvas = this.canvasElement.nativeElement;
      canvas.width = img.width;
      canvas.height = img.height;
    };
    img.src = 'assets/images/car-shape.jpg'; // Set the image source after defining the onload handler
  }

  onImageClick(event: MouseEvent): void {
    if (!this.imageLoaded) {
      console.error('Image not loaded yet.');
      return;
    }

    const imageContainer = this.imageElement.nativeElement.parentElement;
    if (!imageContainer) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let text = '';
    if (this.annotationMode === 'text') {
      const userInput = prompt('Enter text to add:');
      if (userInput) {
        text = userInput;
      } else {
        return; // Exit if no text is entered
      }
    } else if (this.annotationMode === 'x-mark') {
      text = 'X';
    }

    this.markers.push({ x, y, text });
  }

  undoMarker(): void {
    this.markers.pop();
  }

  saveImage(): void {
    if (!this.imageLoaded) {
      console.error('Image not loaded yet.');
      return;
    }

    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = this.imageElement.nativeElement;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.markers.forEach(marker => {
      ctx.fillText(marker.text, marker.x, marker.y);
    });

    const dataURL = canvas.toDataURL('image/png');
    console.log(dataURL); // Logs the Base64 string to the console
  }
}
