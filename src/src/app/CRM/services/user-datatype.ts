export class Address {
    public street: string;
    public address: string;
    public city: string;
    public zipcode: string;
    public state: string;  
    public country: string;
}

export class User {
    constructor(
    public _id: string,
    public _rev: string,
    public member: string,
    public name: string,
    public password: string,
    public question1: string,
    public answer1: string,
    public fathername: string,
    public mothername: string,
    public acctlock: string,
    public email: string,
    public phone: string,
    public website: string,
    public company: string,
    public address = new Address()
    ) {
    }
}