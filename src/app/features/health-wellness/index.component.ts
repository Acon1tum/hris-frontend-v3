import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataset, ChartData } from 'chart.js';
import { VoiceComponent } from './voice/voice.component';
import { FaceScanComponent } from './face-scan/face-scan.component';
import { DigitalFootprintComponent } from './digital-footprint/digital-footprint.component';
import { trigger, transition, style, animate, group, query } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-health-wellness',
  standalone: true,
  imports: [CommonModule, NgChartsModule, VoiceComponent, FaceScanComponent, DigitalFootprintComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('routeAnimation', [
      transition('dashboard => voice, dashboard => face, dashboard => digital', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms cubic-bezier(0.4,0,0.2,1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('400ms cubic-bezier(0.4,0,0.2,1)', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition('voice => dashboard, face => dashboard, digital => dashboard', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms cubic-bezier(0.4,0,0.2,1)', style({ transform: 'translateX(100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(-100%)', opacity: 0 }),
            animate('400ms cubic-bezier(0.4,0,0.2,1)', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ]),
    trigger('pageOpen', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class HealthWellnessComponent {
  constructor(private router: Router) {}
  VoiceComponent = VoiceComponent;
  FaceScanComponent = FaceScanComponent;
  DigitalFootprintComponent = DigitalFootprintComponent;
  title = 'Health & Wellness';
  healthFeatures = [
    { name: 'Health Programs', description: 'Access company health programs', icon: '🏥' },
    { name: 'Wellness Activities', description: 'Participate in wellness activities', icon: '🏃' },
    { name: 'Medical Records', description: 'View and manage medical records', icon: '📋' },
    { name: 'Insurance Management', description: 'Manage health insurance details', icon: '🩺' },
    { name: 'Health Assessments', description: 'Take health assessments and surveys', icon: '📝' },
    { name: 'Support Resources', description: 'Access support and counseling', icon: '🤝' }
  ];

  // Chart.js bar chart labels
  barChartLabels: string[] = ['23/06', '24/06', '25/06', '26/06', '27/06', '28/06', '30/06'];

  // Chart.js bar chart datasets
  allBarChartDatasets: ChartDataset<'bar'>[] = [
    {
      label: 'Good score',
      data: [3, 2, 0, 1, 0, 2, 2],
      backgroundColor: 'rgba(79, 140, 255, 0.85)',
      borderRadius: 12,
      borderSkipped: false,
      barPercentage: 0.55,
      categoryPercentage: 0.6,
      hoverBackgroundColor: 'rgba(12, 127, 242, 1)',
      borderWidth: 0,
    },
    {
      label: 'Bad score',
      data: [0, 1, 1, 0, 2, 0, 1],
      backgroundColor: 'rgba(255, 85, 82, 0.85)',
      borderRadius: 12,
      borderSkipped: false,
      barPercentage: 0.55,
      categoryPercentage: 0.6,
      hoverBackgroundColor: 'rgba(185, 74, 72, 1)',
      borderWidth: 0,
    }
  ];

  // Chart.js bar chart data object
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [...this.allBarChartDatasets]
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: { size: 15, family: 'Inter, Noto Sans, sans-serif' },
          padding: 24,
          boxWidth: 18,
          boxHeight: 18,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    layout: {
      padding: 16
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 14, family: 'Inter, Noto Sans, sans-serif' },
          color: '#60758a',
        }
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: { size: 14, family: 'Inter, Noto Sans, sans-serif' },
          color: '#60758a',
          stepSize: 1,
        },
        beginAtZero: true,
        title: { display: false }
      }
    }
  };

  filterType: 'all' | 'good' | 'bad' = 'all';

  toggleFilter(type: 'good' | 'bad') {
    if (this.filterType === type) {
      this.filterType = 'all';
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [...this.allBarChartDatasets]
      };
    } else {
      this.filterType = type;
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          type === 'good' ? this.allBarChartDatasets[0] : this.allBarChartDatasets[1]
        ]
      };
    }
  }

  get totalScans(): number {
    // Return the number of bars (data points) in the first dataset
    if (this.barChartData.datasets.length > 0 && Array.isArray(this.barChartData.datasets[0].data)) {
      return this.barChartData.datasets[0].data.length;
    }
    return 0;
  }

  // Chart.js doughnut chart data
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Good score', 'Bad score'],
    datasets: [
      {
        data: [
          (this.allBarChartDatasets[0].data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0),
          (this.allBarChartDatasets[1].data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
        ],
        backgroundColor: ['#9cbeff', '#f7b6b6'],
        hoverBackgroundColor: ['#2491ff', '#ff5552'],
        borderWidth: 0,
        borderRadius: 32,
      }
    ]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    cutout: '78%',
  };

  // Chart.js line chart data for Requests
  lineChartData: ChartData<'line'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        // label: 'Total Requests',
        data: [3, 0, 0, 0, 0, 0, 2],
        borderColor: '#4F8CFF',
        backgroundColor: 'rgba(79, 140, 255, 0.25)',
        pointBackgroundColor: '#4F8CFF',
        pointBorderColor: '#4F8CFF',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.2,
        borderWidth: 3,
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    layout: {
      padding: 16
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 14, family: 'Inter, Noto Sans, sans-serif' },
          color: '#60758a',
        }
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: { size: 14, family: 'Inter, Noto Sans, sans-serif' },
          color: '#60758a',
          stepSize: 1,
        },
        beginAtZero: true,
        title: { display: false }
      }
    }
  };

  get totalRequests(): number {
    const good = (this.allBarChartDatasets[0].data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    const bad = (this.allBarChartDatasets[1].data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    return (good ?? 0) + (bad ?? 0);
  }  

  fadeInFlag = true;
  selectedActivity: 'dashboard' | 'voice' | 'face' | 'digital' = 'dashboard';

  selectActivity(type: 'dashboard' | 'voice' | 'face' | 'digital') {
    if (this.selectedActivity !== type) {
      this.fadeInFlag = false;
      setTimeout(() => {
        this.selectedActivity = type;
        this.fadeInFlag = true;
      }, 10);
    }
  }

  goToJoinProgram() {
    this.router.navigate(['/health-wellness/join-program']);
  }

  goToWellnessEvents() {
    this.router.navigate(['/health-wellness/wellness-events']);
  }
} 