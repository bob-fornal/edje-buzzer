
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { BuzzersComponent } from './buzzers.component';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { activatedRouteSpy } from '@shared/_spec-tools/route-spy.spec'

import { BaseMessage } from '@core/interfaces/base-message';

class MockDate {
  constructor() {
    return 
  }
}

describe('BuzzersComponent', () => {
  let component: BuzzersComponent;
  let fixture: ComponentFixture<BuzzersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
      ],
      declarations: [
        BuzzersComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzzersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expects "ngOnInit" to initialize', () => {
    spyOn(component.tools, 'generateUUID').and.returnValue('UUID');
    spyOn(component, 'initApiKey').and.stub();
    spyOn(component, 'initListening').and.stub();

    component.ngOnInit();
    expect(component.uuid).toEqual('UUID');
    expect(component.initApiKey).toHaveBeenCalled();
    expect(component.initListening).toHaveBeenCalled();
  });

  it('expects "initApiKey" to get the key and set it on the socket service', () => {
    spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('API-KEY');
    spyOn(component.socket, 'setApiKey').and.stub();

    component.initApiKey();
    expect(component.socket.setApiKey).toHaveBeenCalledWith('API-KEY');
  });

  it('expects "setTeam" to set the selected team', () => {
    const team: string = 'TEAM';

    component.setTeam(team);
    expect(component.selectedTeam).toEqual(team);
  });

  it('expects "handleSelection" to set selection to false and send a message', () => {
    component.isSelectionActive = true;
    component.uuid = 'UUID';
    component.selectedUsername = 'USERNAME';
    component.selectedTeam = 'TEAM';
    spyOn(component.socket, 'publish').and.stub();
    const expected: BaseMessage = {
      type: 'SELECTED-TEAM',
      payload: {
        uuid: 'UUID',
        username: 'USERNAME',
        team: 'TEAM'
      }
    };

    component.handleSelection();
    expect(component.socket.publish).toHaveBeenCalledWith(expected);
  });

  it('expects "handleBuzzerReset" to set active to true', () => {
    component.active = false;

    component.handleBuzzerReset();
    expect(component.active).toEqual(true);
  });

  it('expects "clickGreenBuzzer" to do nothing if active is false', () => {
    component.active = false;
    spyOn(component.socket, 'publish').and.stub();
    spyOn(component, 'checkAudio').and.stub();

    component.clickGreenBuzzer();
    expect(component.active).toEqual(false);
    expect(component.socket.publish).not.toHaveBeenCalled();
    expect(component.checkAudio).not.toHaveBeenCalled();
  });

  it('expects "clickGreenBuzzer" to send message and check audio', () => {
    component.active = true;
    component.uuid = 'UUID';
    spyOn(component.socket, 'publish').and.stub();
    spyOn(component, 'checkAudio').and.stub();

    component.clickGreenBuzzer();
    expect(component.active).toEqual(false);
    expect(component.socket.publish).toHaveBeenCalled();
    expect(component.checkAudio).toHaveBeenCalled();
  });

  it('expects "checkAudio" to do nothing if name is not dave or david', () => {
    let played: boolean = false;
    const mockDocument: any = {
      getElementById: () => {
        return { play: () => { played = true; } }
      }
    };
    component.selectedUsername = 'BOB';

    component.checkAudio(mockDocument);
    expect(played).toEqual(false);
  });

  it('expects "checkAudio" to do handle dave', () => {
    let played: boolean = false;
    const mockDocument: any = {
      getElementById: () => {
        return { play: () => { played = true; } }
      }
    };
    component.selectedUsername = 'I AM DAVE';

    component.checkAudio(mockDocument);
    expect(played).toEqual(true);
  });

  it('expects "checkAudio" to do handle david', () => {
    let played: boolean = false;
    const mockDocument: any = {
      getElementById: () => {
        return { play: () => { played = true; } }
      }
    };
    component.selectedUsername = 'david';

    component.checkAudio(mockDocument);
    expect(played).toEqual(true);
  });

});
