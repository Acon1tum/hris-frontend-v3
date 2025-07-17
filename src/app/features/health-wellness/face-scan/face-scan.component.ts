import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as faceapi from 'face-api.js';

interface FaceScanReport {
  expression: string;
  ageGroup: 'Young' | 'Adult';
  mole: boolean;
  pimples: boolean;
  clearSkin: boolean;
  faceShape: string;
  paleLips: boolean;
}

@Component({
  selector: 'app-face-scan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './face-scan.component.html',
  styleUrls: ['./face-scan.component.scss']
})
export class FaceScanComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  scanResult: string | null = null;
  isScanning = false;
  cameraOpen = false;
  faceScanReport: FaceScanReport | null = null;
  modelsLoaded = false;
  error: string | null = null;

  async ngOnInit() {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/assets/models');
      this.modelsLoaded = true;
    } catch (e) {
      this.error = 'Failed to load face detection models.';
    }
  }

  async openCamera() {
    this.scanResult = null;
    this.faceScanReport = null;
    this.error = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = stream;
      }
      this.cameraOpen = true;
    } catch (err) {
      this.scanResult = 'Camera access denied or not available.';
      this.cameraOpen = false;
    }
  }

  async startFaceScan() {
    this.scanResult = null;
    this.isScanning = true;
    this.faceScanReport = null;
    this.error = null;
    setTimeout(async () => {
      this.isScanning = false;
      const video = this.videoElement.nativeElement;
      if (!video || video.readyState < 2) {
        this.error = 'Camera not ready. Please try again.';
        return;
      }
      try {
        const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()
          .withAgeAndGender();
        if (detection) {
          this.scanResult = 'Face detected!';
          this.faceScanReport = {
            expression: this.getDominantExpression(detection.expressions),
            ageGroup: detection.age < 25 ? 'Young' : 'Adult',
            mole: false, // Advanced: needs custom model
            pimples: false, // Advanced: needs custom model
            clearSkin: true, // Advanced: needs custom model
            faceShape: 'Oval', // Advanced: can be estimated from landmarks
            paleLips: false // Advanced: can be estimated from landmarks/colors
          };
        } else {
          this.scanResult = 'No face detected!';
          this.faceScanReport = null;
        }
      } catch (e) {
        this.error = 'Face scan failed. Please try again.';
      }
    }, 2000);
  }

  getDominantExpression(expressions: any): string {
    return Object.entries(expressions)
      .sort((a: any, b: any) => b[1] - a[1])[0][0];
  }
} 