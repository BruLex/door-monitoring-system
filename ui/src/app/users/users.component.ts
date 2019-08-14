import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private appSrv: AppService) {
    appSrv.setAppConfig({title: 'Users'});
  }

  ngOnInit() {
  }

}
