import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';

import { catchError, map, startWith, switchMap } from 'rxjs/operators';

interface DoorData {
  name: string;
  description: string;
  ip: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.scss']
})
export class DoorsComponent implements OnInit, AfterViewInit {

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
      console.log(modal, trigger);
    },
    complete: () => { alert('Closed'); } // Callback for Modal close
  };
  dialog: MatDialog;

  loading = false;
  selection: SelectionModel<DoorData> = new SelectionModel<DoorData>(true, []);
  dataSource: MatTableDataSource<DoorData> = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild('loadswitch', {static: true}) loadswitch: ElementRef;
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  fakeData: DoorData[] = [
    {name: 'door1', description: '', ip: '192.168.52.82'},
    {name: 'door2', description: '', ip: '192.168.174.159'},
    {name: 'door3', description: '', ip: '192.168.159.159'},
    {name: 'door4', description: '', ip: '192.168.206.115'},
    {name: 'door5', description: '', ip: '192.168.121.77'},
    {name: 'door6', description: '', ip: '192.168.21.231'},
    {name: 'door7', description: '', ip: '192.168.86.114'},
    {name: 'door8', description: '', ip: '192.168.252.170'},
    {name: 'door9', description: '', ip: '192.168.211.78'},
    {name: 'door10', description: '', ip: '192.168.60.226'},
    {name: 'door1', description: '', ip: '192.168.52.82'},
    {name: 'door2', description: '', ip: '192.168.174.159'},
    {name: 'door3', description: '', ip: '192.168.159.159'},
    {name: 'door4', description: '', ip: '192.168.206.115'},
    {name: 'door5', description: '', ip: '192.168.121.77'},
    {name: 'door6', description: '', ip: '192.168.21.231'},
    {name: 'door7', description: '', ip: '192.168.86.114'},
    {name: 'door8', description: '', ip: '192.168.252.170'},
    {name: 'door9', description: '', ip: '192.168.211.78'},
    {name: 'door10', description: '', ip: '192.168.60.226'},
    {name: 'door1', description: '', ip: '192.168.52.82'},
    {name: 'door2', description: '', ip: '192.168.174.159'},
    {name: 'door3', description: '', ip: '192.168.159.159'},
    {name: 'door4', description: '', ip: '192.168.206.115'},
    {name: 'door5', description: '', ip: '192.168.121.77'},
    {name: 'door6', description: '', ip: '192.168.21.231'},
    {name: 'door7', description: '', ip: '192.168.86.114'},
    {name: 'door8', description: '', ip: '192.168.252.170'},
    {name: 'door9', description: '', ip: '192.168.211.78'},
    {name: 'door10', description: '', ip: '192.168.60.226'},
    {name: 'door1', description: '', ip: '192.168.52.82'},
    {name: 'door2', description: '', ip: '192.168.174.159'},
    {name: 'door3', description: '', ip: '192.168.159.159'},
    {name: 'door4', description: '', ip: '192.168.206.115'},
    {name: 'door5', description: '', ip: '192.168.121.77'},
    {name: 'door6', description: '', ip: '192.168.21.231'},
    {name: 'door7', description: '', ip: '192.168.86.114'},
    {name: 'door8', description: '', ip: '192.168.252.170'},
    {name: 'door9', description: '', ip: '192.168.211.78'},
    {name: 'door10', description: '', ip: '192.168.60.226'},
    {name: 'door1', description: '', ip: '192.168.52.82'},
    {name: 'door2', description: '', ip: '192.168.174.159'},
    {name: 'door3', description: '', ip: '192.168.159.159'},
    {name: 'door4', description: '', ip: '192.168.206.115'},
    {name: 'door5', description: '', ip: '192.168.121.77'},
    {name: 'door6', description: '', ip: '192.168.21.231'},
    {name: 'door7', description: '', ip: '192.168.86.114'},
    {name: 'door8', description: '', ip: '192.168.252.170'},
    {name: 'door9', description: '', ip: '192.168.211.78'},
    {name: 'aaaa', description: '', ip: '192.168.60.226'}
  ];


  constructor(private appSrv: AppService,
              dialog: MatDialog) {
    appSrv.setAppConfig({title: 'Doors'});
    this.dialog = dialog;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

  }

  ngAfterViewInit(): void {
    console.log(this.paginator);

    this.sort.sortChange.subscribe(() => {
      this.sort.direction === 'desc'
        ? this.fakeData.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        : this.fakeData.sort((a, b) => a.name > b.name ? -1 : a.name < b.name ? 1 : 0);
      this.paginator.pageIndex = 0;
    });
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return observableOf(this.fakeData);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = this.fakeData.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.fakeData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.fakeData.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DoorData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name}`;
  }

}
