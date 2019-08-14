import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  constructor(private appSrv: AppService) {
    appSrv.setAppConfig({title: 'Groups'});
  }

  ngOnInit() {
  }

}
