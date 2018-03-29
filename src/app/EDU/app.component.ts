import { Component, OnInit } from '@angular/core';
import { eLabService } from './services/elab.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  data;

  constructor(private _eLabService: eLabService) {}

ngOnInit() {
    }
}