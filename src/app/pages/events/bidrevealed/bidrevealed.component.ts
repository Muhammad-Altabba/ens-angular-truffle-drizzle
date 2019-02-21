import { Component, OnInit } from '@angular/core';
import { EnsService } from '../../../util/ens.service';
import { UnsealedBids, UNSEALEDBID_COLUMNS } from '../../../classes/unsealedbids';
import { Web3Service } from '../../../util/web3.service';

@Component({
  selector: 'app-bidrevealed',
  templateUrl: './bidrevealed.component.html',
  styleUrls: ['./bidrevealed.component.css']
})
export class BidRevealedComponent implements OnInit {

  // datatable columns
  cols: any = UNSEALEDBID_COLUMNS;

  unsealedBids: UnsealedBids[];
  constructor(private web3Service: Web3Service, public ensService: EnsService) { }
  ngOnInit() {
    this.ensService.isInitialized$.subscribe(isInitialized => {
      if (isInitialized)
        this.getData();
    });
  }

  async getData() {
    const fromBlock = await this.web3Service.getBlockNumberHoursAGo(24);
    this.unsealedBids = await this.ensService.getUnsealedBids({},  await this.web3Service.Web3.eth.getBlockNumber() - 5800);
  }

}
