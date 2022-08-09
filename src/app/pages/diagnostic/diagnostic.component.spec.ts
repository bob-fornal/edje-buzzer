
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DiagnosticComponent } from './diagnostic.component';

import { activatedRouteSpy } from '@shared/_spec-tools/route-spy.spec'

import { BaseMessage } from '@core/interfaces/base-message';

describe('DiagnosticComponent', () => {
  let component: DiagnosticComponent;
  let fixture: ComponentFixture<DiagnosticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DiagnosticComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expects "ngOnInit" to initialize', () => {
    spyOn(component, 'initApiKey').and.stub();
    spyOn(component, 'setTimeout').and.stub();

    component.ngOnInit();
    expect(component.initApiKey).toHaveBeenCalled();
    expect(component.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1000);
  });

  it('expects "initApiKey" to get the key and set it on the socket service', () => {
    spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('API-KEY');
    spyOn(component.socket, 'setApiKey').and.stub();

    component.initApiKey();
    expect(component.socket.setApiKey).toHaveBeenCalledWith('API-KEY');
  });

  it('expects "initProcesses" to get the initial value', () => {
    const base: string = JSON.stringify(component.defaultBaseObject);

    component.initProcesses();
    expect(component.jsonInput.nativeElement.value).toEqual(base);
  });

  it('expects "sendMessage" to take content and publish it', () => {
    const content: any = { content: 'CONTENT' };
    const contentString: string = JSON.stringify(content);
    spyOn(component.socket, 'publish').and.stub();

    component.sendMessage(contentString);
    expect(component.socket.publish).toHaveBeenCalledWith(content);
  });

  it('expects "handleMessage" to add message to the responses array', () => {
    const message: BaseMessage = {
      type: 'TYPE',
      payload: 'PAYLOAD'
    };
    const messageString: string = JSON.stringify(message);
    component.responses = [];
    
    component.handleMessage(message);
    expect(component.responses).toEqual([ messageString ]);
  });

});
