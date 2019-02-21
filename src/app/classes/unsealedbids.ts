import { Time } from "@angular/common";
import { BlockUI } from "primeng/primeng";

export const UNSEALEDBID_COLUMNS = [
    // { field: 'hash', header: 'Name Hash' },
    // { field: 'owner', header: 'Owner' },
    { field: 'value', header: 'Value' },
    { field: 'statusAsString', header: 'Status' },
    { field: 'time', header: 'Time' },
    // { field: 'blocknumber', header: 'Block' },
  ];
    
const UnsealedBidsStatus: string[] = [
    'Bid too low or too late, refund 99.5%',
    'Too late! Bidder loses their bid. Get\'s 0.5% back.',
    'New winner',
    'Not winner, but affects second place',
    'Bid doesn\'t affect auction',
    'Cancel Bid'
]
export class UnsealedBids {
    public blocknumber: number;
    public time: Date;
    public async setBlock(block: Promise<any>) {
        const b = await block;
        this.blocknumber = b.number;
        this.time = new Date(b.timestamp * 1000);
    }
    public block: string;
    public hash: string;
    public owner: string;
    public value:number;
    public status: number;
    public get statusAsString(): string { 
        if(this.status < UNSEALEDBID_COLUMNS.length)
            return UnsealedBidsStatus[this.status];
        else
            return this.status.toString();
    }
}