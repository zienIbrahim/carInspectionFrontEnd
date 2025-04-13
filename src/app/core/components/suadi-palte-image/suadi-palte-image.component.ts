import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-suadi-palte-image',
  imports: [CommonModule],
  templateUrl: './suadi-palte-image.component.html',
  styleUrl: './suadi-palte-image.component.scss'
})
export class SuadiPalteImageComponent implements OnChanges {
  @Input() plateValue: string = ''; // مثال: "أبج-1234"
  lettersEn: string[] = [];
  lettersAr: string[] = [];
  digitsEn: string[] = [];
  digitsHindi: string[] = [];

  private enToArLetters: { [key: string]: string } = {
    'A': 'ا', 'B': 'ب', 'J': 'ح', 'D': 'د', 'R': 'ر', 'S': 'س', 'X': 'ص',
    'T': 'ط', 'E': 'ع', 'G': 'ق', 'K': 'ك', 'L': 'ل', 'Z': 'م', 'N': 'ن',
    'H': 'هـ', 'U': 'و', 'V': 'ى'
  };

  private arToEnLetters: { [key: string]: string } = Object.fromEntries(
    Object.entries(this.enToArLetters).map(([en, ar]) => [ar, en])
  );

  private hindiDigits: string[] = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  private arNumbers: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };

  ngOnChanges(): void {
    if (!this.plateValue.includes('-')) return;

    const [rawLetters, rawDigits] = this.plateValue.split('-').map(part => part.trim().replace(/\s+/g, ''));

    // حروف (تلقائي: إنجليزية ← عربية والعكس)
    const lettersArray = rawLetters.split('');
    this.lettersEn = lettersArray.map(l => this.arToEnLetters[l] || l.toUpperCase());
    this.lettersAr = lettersArray.map(l => this.enToArLetters[l.toUpperCase()] || l);

    // أرقام
    const digitsArray = rawDigits.split('');
    this.digitsEn = digitsArray.map(d => this.arNumbers[d] || d); // إلى إنجليزي
    this.digitsHindi = this.digitsEn.map(d => this.hindiDigits[+d] || '');
  }
  
}
