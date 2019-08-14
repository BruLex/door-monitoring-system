import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  get title() {
    return this.appService.getConfig().title;
  }

  constructor(private appService: AppService) {

  }
}
