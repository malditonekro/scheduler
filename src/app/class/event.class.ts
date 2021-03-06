export class Event {
    constructor(
        public id: number,
        public domainId:number,
        public alias:string,
        public eventTypeId: number,
        public title: string,
        public start: string,
        public end?: string,        
        public allDay?: boolean,
        public url?: string,
        public className?: string,
        public editable?: boolean,
        public startEditable?: boolean,
        public durationEditable?:boolean,
        public resourceEditable?:boolean,
        public rendering?: string,
        public overlap?: boolean,
        public constraint?: {},
        public source?: string,
        public color?: string,
        public backgroundColor?: string,
        public borderColor?: string,
        public textColor?: string,
        public offerId?:number,
        public interviewer?: string,
        public interviewerEmail?: string,
        public creationDate?: string,
        public modificationDate?:string,
        public place?: string,
        public iAmInterviewer?: boolean,
        public sendBackupEmail?: boolean,
        public participants?: Object[],
        public applicantComment?: string,
        public internalComment?: string,
        public file?:string,
        public hourStart?:string,
        public hourEnd?:string,
        public deleted?:boolean,
    ){}
}
