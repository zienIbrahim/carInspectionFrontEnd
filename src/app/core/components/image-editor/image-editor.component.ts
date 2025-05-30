import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule  } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { modelTypeImageUrl } from '../../data/modelType';

@Component({
  selector: 'app-image-editor',
  imports: [CommonModule,InputTextModule ,PopoverModule,MenubarModule,FormsModule,CardModule,RadioButton, ButtonModule],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements OnInit, AfterViewInit{
  ngOnInit(): void {
  }
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('op') overlayPanel!: Popover;

  lastClickEvent!: MouseEvent;

  markers: { x: number; y: number; text: string }[] = [];
  @Input() imageMarkers:{ x: number; y: number; text: string }[] = [];
  annotationMode: 'text' | 'x-mark' = 'x-mark';
  imageLoaded = false;
  userInput: string = '';
  _modelTypeImageUrl=modelTypeImageUrl;
  @Input() modelType: number=0; 
  @Input() ImageDir: number=0; 
  @Output() OnSaveImags = new EventEmitter<{imageUrl:string,markers: { x: number; y: number; text: string }[]}>();
  imageUrl: string = '';
constructor(){

}
  ngAfterViewInit() {
    console.log({modelType:this.modelType})
    console.log({ImageDir:this.ImageDir})
    console.log({modelTypeImageUrl:this._modelTypeImageUrl})
    this.imageUrl ="assets/images/cars/"+this._modelTypeImageUrl.find(x=> x.id==this.modelType).Images.find(c=>c.dir==this.ImageDir).url;
    if(this.imageMarkers.length>0){
      this.markers=this.imageMarkers;
    }
  }
  onImageClick(event: MouseEvent): void {
   
    const imageContainer = this.imageElement.nativeElement.parentElement;
    if (!imageContainer) return;
    const rect = imageContainer.getBoundingClientRect();
    this.lastClickEvent = event; // Store event for overlay positioning
    const x = ((this.lastClickEvent.clientX - rect.left) / rect.width) * 100;
    const y = ((this.lastClickEvent.clientY - rect.top) / rect.height) * 100;

    if (this.annotationMode === 'text') {
      this.overlayPanel.show(event,event.target);
      if (this.overlayPanel.container) {
          this.overlayPanel.align();
      } // Show popover for input
    } 
    else if (this.annotationMode === 'x-mark') {
      this.markers.push({ x, y, text: 'X' });
      this.saveImage();

    }
  }
  confirmAnnotation(overlay: Popover) {
    if (this.userInput) {
      const rect = this.imageElement.nativeElement.parentElement.getBoundingClientRect();
      const x = ((this.lastClickEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((this.lastClickEvent.clientY - rect.top) / rect.height) * 100;
      this.markers.push({ x, y, text: this.userInput });
      this.userInput = ''; // Reset input field
      overlay.hide();
      this.saveImage();

    }
  }
  undoMarker(): void {
    this.markers.pop();
    this.saveImage();
  }
  saveImage(): void {
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
    this.OnSaveImags.emit({imageUrl:dataURL,markers:this.markers}); // Emit the Base64 string
  }
}
