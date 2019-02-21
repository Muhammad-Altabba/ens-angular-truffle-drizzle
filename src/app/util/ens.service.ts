import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

declare let require: any;
const ENSRegistrar_artifacts = require('../../../build/contracts/ENS-Registrar.json');
import { UnsealedBids } from '../classes/unsealedbids';
import { ReplaySubject } from 'rxjs';
import { DrizzleService } from './drizzle.service';


@Injectable()
export class EnsService {
  static CONTRACTADDRESS = "0x6090a6e47849629b7245dfa1ca21d94cd15878ef";
  static CONTRACTNAME : string;
  static BIDREVEALED_EVENTNAME = 'BidRevealed';

  isInitialized$ = new ReplaySubject<boolean>(1);

  constructor(private web3Service: Web3Service, private drizzleService: DrizzleService) {
    this.init();
  }

  async init() {
    try {
      const ensRegistrarTruffleContract = await this.web3Service.artifactsToContract(ENSRegistrar_artifacts);

      const registrarContractInstance = await ensRegistrarTruffleContract.at(EnsService.CONTRACTADDRESS);
      
      EnsService.CONTRACTNAME = registrarContractInstance.contractName = ensRegistrarTruffleContract.contractName;

      if (await this.drizzleService.isDrizzleInitialized()) {
        await this.drizzleService.addContract(registrarContractInstance, [EnsService.BIDREVEALED_EVENTNAME]);

        this.isInitialized$.next(true);
      } else {
        throw new Error("Drizzle is not Initialized!");
      }

    } catch (error) {
      console.log(error);
      this.isInitialized$.next(false);
    }

  }

  async getUnsealedBids(filter: {}, // ex. {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
    fromBlock: number,  //ex. 7228340
    toBlock: number | string = 'latest'): Promise<UnsealedBids[]> {


    const eventOptions = {
      filter: filter,
      fromBlock: fromBlock,
      toBlock: toBlock
    };

    // // to get events one by one
    // this.drizzle.contracts.Registrar.events
    //   .BidRevealed(eventOptions, (error, event) => {
    //     console.log(error, event);
    //   })
    //   .on('data', (event) => console.log(event))
    //   .on('changed', (event) => console.log(event))
    //   .on('error', (error) => console.log(error));

    const eventsArray = await this.drizzleService.getPastEvents(EnsService.CONTRACTNAME, 
      EnsService.BIDREVEALED_EVENTNAME, 
      eventOptions);

    const unsealedBids: UnsealedBids[] = new Array(eventsArray.length);
    const blockPromies = new Array(eventsArray.length);
    for (let index = 0; index < eventsArray.length; index++) {
      const event = eventsArray[eventsArray.length - 1 - index];
      unsealedBids[index] = new UnsealedBids();

      // Read from topics because of a problem with: eventsArray[index].returnValues.hash;
      // (`returnValues.hash` wrongly contains the event name hashed!)
      unsealedBids[index].hash = event.raw.topics[1];

      // To get the name, some work has to be done according to, 
      // with the help of something similar to: https://raw.githubusercontent.com/ethereum/ens-registrar-dapp/master/app/public/preimages.js
      // unsealedBids[index].name = lookup[hash];

      // Read from topics because of a problem with: eventsArray[index].returnValues.owner;
      // (`returnValues.owner` wrongly has the value that suppose to be in `returnValues.hash`!)
      unsealedBids[index].owner = '0x' + event.raw.topics[2].substring(26);
      unsealedBids[index].value = this.web3Service.Web3.utils.fromWei(event.returnValues.value);
      unsealedBids[index].status = event.returnValues.status;
      const block = this.web3Service.Web3.eth.getBlock(event.blockNumber);
      unsealedBids[index].setBlock(block);
      blockPromies[index] = block;
    }

    // await Promise.all(blockPromies);
    return unsealedBids;
  }
}
