import {Component, OnInit} from '@angular/core';
import {LogsService} from '../_service/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: any;

  constructor(private logsService: LogsService) {
  }

  ngOnInit(): void {
    this.logsService.getLogs().subscribe((data) => {
      this.logs = data;
      console.log(this.logs);
    });
  }
}
