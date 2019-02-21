import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

declare let require: any;
const Web3 = require('web3');

import contract from 'truffle-contract';

// Without the following line an error will occur: TypeError: truffle_contract_1.default is not a function
const contract = require('truffle-contract');


declare let window: any;

@Injectable()
export class Web3Service {

  public static AVERAGEBLOCKTIME = 15.65; // estimatd based one data of the pervious year: https://etherscan.io/chart/blocktime

  private web3: any;
  public get Web3(): any {
    return this.web3;
  }
  private accounts: string[];
  public get wallet(): string {
    if (this.accounts != null && this.accounts.length !== 0) {
      return this.accounts[0];
    } else {
      return null;
    }
  }
  public ready = false;

  public accountsObservable = new ReplaySubject<string>(1);

  private isErrorGettingAccountsReported = false;

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {

    if (window.ethereum) {
      // use MetaMask's provider
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable(); // get permission to access accounts
    } else {
      console.warn(
        "No web3 detected. Falling back to https://mainnet.infura.io/",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider("https://mainnet.infura.io/"),
      );
    }

    setInterval(() => this.refreshAccounts(), 340);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 200));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      // console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        if (!this.isErrorGettingAccountsReported) {
          this.isErrorGettingAccountsReported = true;
          console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        }
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        this.accounts = accs;
        this.accountsObservable.next(accs);
      }

      this.ready = true;
    });
  }
    
  public async getBlockNumberHoursAGo(hours: number) : Promise<number> {
    return await this.Web3.eth.getBlockNumber() - hours * 60 * 60 / Web3Service.AVERAGEBLOCKTIME;
  }
}

