import { Injectable } from '@angular/core';

import { Drizzle } from 'drizzle';
import { Web3Service } from './web3.service';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class DrizzleService {

  drizzle: Drizzle;
  drizzleObservable = new ReplaySubject<Drizzle>(1);
  
  constructor(private web3Service: Web3Service) {
    this.init();
  }


  async init() {

    const options = {
      contracts: [], // Without providing an empty array, an error will be raised
      web3: {
        fallback: { 
          // Will not connect to infura because is a problem in web3 v1.0.0-beta35
          //  I kept the code for later use once drizzle is upgreaded.
          type: "ws",
          url: "wss://mainnet.infura.io/ws"
        }
      }
    }

    this.drizzle = new Drizzle(options);
    
    if (await this.isDrizzleInitialized()) {
      this.drizzleObservable.next(this.drizzle);
    } else {
      this.drizzleObservable.next(null);
    }


  }

  async addContract(truffleContract: any, events: string[]) {

    if(!truffleContract.contractName) {
      throw new Error('When Calling Drizzle.addContract(...), TruffleContract.contractName is not defined.');
    }
    var contractConfig = {
      contractName: truffleContract.contractName, 
      web3Contract: truffleContract.contract
    }

    // Using an action
    // dispatch({type: 'ADD_CONTRACT', drizzle, contractConfig, events, this.web3Service.Web3})

    // Or using the Drizzle context object
    this.drizzle.addContract(contractConfig, events)
  }

  async isDrizzleInitialized(maxWait = 10000, sleepPeriod = 100): Promise<boolean> {
    var state = this.drizzle.store.getState();
    const maxTries = maxWait / sleepPeriod;
    let counter = 0;
    while (!state.drizzleStatus.initialized && counter < maxTries) {
      await new Promise(resolve => setTimeout(resolve, sleepPeriod));
      state = this.drizzle.store.getState();
      counter++;
    }
    if (state.drizzleStatus.initialized) {
      return true;
    } else {
      return false;
    }
  }

  async ensureDrizzleInitialization() {
    const isDrizzleInitialized = await this.isDrizzleInitialized();
    if (!isDrizzleInitialized) {
      throw new Error('Something wrong with Drizzle Initialization.');
    }
  }

  async getPastEvents(contractName: string, event: string = 'allEvents', options: any) {

    await this.ensureDrizzleInitialization();

    const web3 = this.drizzle.web3;
    const contract = this.drizzle.contracts[contractName];
    const yourContractWeb3 = new web3.eth.Contract(contract.abi, contract.address);
    return await yourContractWeb3.getPastEvents(event, options);
  }

}
