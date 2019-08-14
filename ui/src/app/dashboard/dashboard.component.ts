import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';

interface DoorData {
  mac: string;
  locked: boolean;
  status: boolean;
  icon: 'lock' | 'lock_open' | 'security' | 'verified_user'
}

enum DoorStatus {
  Offline,
  Online,
}

enum LockedStatus {
  Locked,
  Uocked,
  Guard
}


const StatusIcon = {
  locked: 'lock',
  unlocked: 'lock_open',
  guard: 'security',
  opened: 'verified_user',
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  loading = false;

  @ViewChild('loadswitch', {static: true}) loadswitch: ElementRef;

  fakeData: DoorData[] = [
    {mac: 'A4-71-9F-DB-1B-B3', status: false, locked: false, icon: 'security'},
    {mac: 'A4-71-9F-DB-1B-B3', status: true, locked: true, icon: 'lock'},
    {mac: 'A4-71-9F-DB-1B-B3', status: false, locked: false, icon: 'lock_open'},
    {mac: 'A4-71-9F-DB-1B-B3', status: true, locked: false, icon: 'verified_user'}
  ];

  constructor(private appSrv: AppService) {
    appSrv.setAppConfig({title: 'Dashboard'});
  }

  ngOnInit() {
  }

}
