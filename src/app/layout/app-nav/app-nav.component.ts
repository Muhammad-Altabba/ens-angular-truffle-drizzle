import { Component, OnInit } from '@angular/core';
import { MenubarModule, } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Web3Service } from '../../util/web3.service';

@Component({
  selector: 'jhi-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
})
export class AppNavComponent implements OnInit {

  public items: MenuItem[];

  constructor(public web3Service: Web3Service) {
  }

  ngOnInit() {
    this.fillMenuItems();
  }

  private fillMenuItems() {
    this.items = [
      {
        label: 'Unsealed Bids',
        routerLink: ['/events/unsealedbids'],
      },
    ];
  }
}
