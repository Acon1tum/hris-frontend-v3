import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinProgramComponent } from './join-program.component';

describe('JoinProgramComponent', () => {
  let component: JoinProgramComponent;
  let fixture: ComponentFixture<JoinProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinProgramComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of programs', () => {
    expect(component.programs.length).toBeGreaterThan(0);
  });

  it('should alert when joining a program', () => {
    spyOn(window, 'alert');
    const program = component.programs[0];
    component.joinProgram(program);
    expect(window.alert).toHaveBeenCalledWith(`You have joined the program: ${program.title}`);
  });
}); 