import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoiceComponent } from './voice.component';

describe('VoiceComponent', () => {
  let component: VoiceComponent;
  let fixture: ComponentFixture<VoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add animation class when upload card is shown', () => {
    component.showUploadCard = true;
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('.voice-upload-card');
    expect(card.classList).toContain('voice-upload-card-animate');
  });
}); 