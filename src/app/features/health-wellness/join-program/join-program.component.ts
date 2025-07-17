import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Program {
  type: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-join-program',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-program.component.html',
  styleUrls: ['./join-program.component.scss']
})
export class JoinProgramComponent implements OnInit {
  constructor(private router: Router) {}
  programs: Program[] = [
    {
      type: 'Article',
      title: 'Healthy Eating Habits',
      description: 'Learn about the importance of balanced diets and how to incorporate more fruits and vegetables into your meals.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrubEoNIbA8KpV7pY5XegCZTevomsbvxW-lKCeg6fTcoSQbeCfvcSgaKDhcDhDwhWUFO33f6RpDzM_4t5jH-OftFDaGbNkPb1O8ue9ybqcwhGHiNXGSBV4as61a9cbdhyvLKPIIk18H9y6sFt6_FUYJ0g6QkMb8G28Q4H-cqQrFcMDpSbaibIidFpdit_CN4s7CdY8BjeTyZPT-nCfze3f4dSy86OAygLKVcBEJBElQpE44Uk9f79OZ7axS1_RbDVWl0tM3MMQTLg'
    },
    {
      type: 'Guide',
      title: 'Managing Anxiety',
      description: 'Discover techniques to manage anxiety and improve your mental wellbeing.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUBIqFySzJXmUObxIO25oLlRzru5eq6b3_gf9uterywv5YKV6pWOUI5eLRVhQQBGmsSWAZ0b-EaJMSzNKmliLtldxWoEBmc20GY7ir3rhamfFw0bUSGDE-Yj_jp366L5TEySdh9QTkR_f1MuDwLP3tzKeMhy8j6Mh37ZpSPAKXgRlV0ymGHRisRBLm83F8tkq0nLIRhuHZYMzLS0kwzsl7F8wZO_gVx4uecF6rLFzwuAowaLAivUq88B_boh-qJTcCjn3e0WVfZcg'
    },
    {
      type: 'Article',
      title: 'Home Workout Guide',
      description: 'A comprehensive guide to effective workouts you can do from the comfort of your home.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAii5zsPhW2FBMwww5eRDif7oE5-yFWbg_9sw1Q6Y9NqmG1T0QAkL8A9MDXAEpfQj_8yy631_36w6-vE0L5kpCFndv9_xlU_6mk4SK239tTMJISPZ9WbG3d-G327L-BNU-BGOa3iNi-7BkepLM3fwfldvWRTS28UaJhPoHAcSbboHA75nacHNzD2QKJPiQ3q6o-JJjEaYFReHlS0NepZ7DEWb6ngzL9GQzYrYhIcpJhtu9wJz0ma0D_k4HEbb616SDj3ycDzXCYDzk'
    },
    {
      type: 'Guide',
      title: 'Stress Reduction Techniques',
      description: 'Explore various methods to reduce stress, including mindfulness and relaxation exercises.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOY9Sq5UOcbGdyDvYgvg-CAsLezQbfJk2tdf8E_s4do3-d55D3fEM9l9YHo-rUW2m5Qq04BuHFLEsA5_W_SdIvN_ZhAKJTG3p3pzs9IRqCYbTaS_zTbiY3cTSaXk77UxaB_dwi4zB2g6Jxc2FbaMrZfC_OmFnkmFK7EicANWtNy8ULZgpzkDafEIZD-NRSsludVgwNNGyr2hiJTbeN7LjAt9Lvd4rIfQEsxacsNkVPmaNJNK1kkgoNp_sSycy1NNaJmJMACcIct08'
    },
    {
      type: 'Article',
      title: 'Improving Sleep Quality',
      description: 'Tips and strategies to enhance your sleep quality and achieve restful nights.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYU00ito5arxrjqLdkeITi-b_yr1tjrvOUMOWxyWYqpRCe5MPpt45ZTKNhqy1FR3kdwlpCM3UOc0z2NHNag7uzgAvBGTc2S0phm_r4iB8MKYqIaSGdaVZb5RkIXxReEebeVW0eZ9KhmASlU5ygXEpNNx06MsSfhXtDYa9BROqP43n4ghjVVC3JllAQigWnaN3LmWJ4ECdQ9BQ9PRRLK4ytjxoKNfbTri0Uza7Y3Ko1JIkS40i1NTZfMabcEJwpDCy1uBMm_8saJ80'
    }
  ];

  joinProgram(program: Program) {
    alert(`You have joined the program: ${program.title}`);
  }

  goBack() {
    this.router.navigate(['/health-wellness']);
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 