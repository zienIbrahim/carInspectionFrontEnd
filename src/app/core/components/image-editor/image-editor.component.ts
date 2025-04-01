import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { modelTypeImageUrl } from '../../data/modelType';
import { Tabs, TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-image-editor',
  imports: [CommonModule, TabsModule, InputTextModule, PopoverModule, MenubarModule, FormsModule, CardModule, RadioButton, ButtonModule],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }
  @ViewChildren('imageElement') imageElements!: QueryList<ElementRef>;

  @ViewChild('popover') overlayPanel!: Popover;
  @ViewChild('tb') tabs!: Tabs;

  lastClickEvent!: MouseEvent;

  markers: { x: number; y: number; text: string }[] = [];
  annotationMode: 'text' | 'x-mark' = 'x-mark';
  imageLoaded = false;
  userInput: string = '';
  _modelTypeImageUrl = modelTypeImageUrl;
  @Input() modelType: number = 1;
  @Output() OnSaveImags = new EventEmitter<string[]>();

  images :{
    id: number;
    name: string;
    url: string;
    markers: any[];
}[]=[];

  selectedImageIndex: number | null = null;
  displayDialog = false;
  constructor() {
    const image = modelTypeImageUrl.filter(x => x.id == this.modelType)[0].Images
    this.images = [
      { id: 1, name: 'Image 1', url: image[0], markers: [] },
      { id: 2, name: 'Image 2', url: image[1], markers: [] },
      { id: 3, name: 'Image 2', url: image[2], markers: [] },
      { id: 4, name: 'Image 3', url: image[3], markers: [] }
    ];
  }
  onImageClick(event: MouseEvent, imageIndex: number) {
    this.lastClickEvent = event;
    this.selectedImageIndex = imageIndex;

    if (this.annotationMode === 'text') {
      this.overlayPanel.show(event)
      
    } else if (this.annotationMode === 'x-mark') {
      this.addMarker('X');
    }
  }

  confirmAnnotation() {
    if (this.userInput) {
      this.addMarker(this.userInput);
      this.userInput = '';
      this.overlayPanel.hide()
    }
  }

  private addMarker(text: string) {
    if (this.selectedImageIndex === null) return;

    // Get the clicked image reference
    const imageElement = this.imageElements.toArray()[this.selectedImageIndex].nativeElement;
    const rect = imageElement.getBoundingClientRect();

    // Ensure marker position is relative to the image
    const x = this.lastClickEvent.offsetX;
    const y = this.lastClickEvent.offsetY;

    // Ensure markers stay inside the image bounds
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    this.images[this.selectedImageIndex].markers.push({ x, y, text });
  }
  saveAllImages() {
    // Create an array of Promises for each image
    const imagePromises = this.images.map((imageData) => {
      return new Promise<string>((resolve) => {
        const image = new Image();
        image.src = 'assets/images/cars/' + imageData.url;
  
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve('');
  
          // Set canvas size to image size
          canvas.width = image.width;
          canvas.height = image.height;
  
          // Draw image onto canvas
          ctx.drawImage(image, 0, 0, image.width, image.height);
  
          // Draw annotations
          imageData.markers.forEach((marker) => {
            ctx.fillStyle = 'red';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(marker.text, marker.x, marker.y);
          });
  
          // Convert to base64 and resolve the Promise
          resolve(canvas.toDataURL('image/png'));
        };
  
        image.onerror = () => resolve(''); // Resolve with empty string if image fails
      });
    });
  
    // Wait for all images to be processed
    Promise.all(imagePromises).then((updatedImages) => {
      this.OnSaveImags.emit(updatedImages.filter(img => img !== '')); // Remove failed images if any
    });
  }
  undoMarker(imageIndex: number){
    this.selectedImageIndex = imageIndex;
    const markers = this.images[this.selectedImageIndex].markers;
  
    if (markers.length > 0) {
      markers.pop(); // Remove last added marker
    }
  }
  
}
