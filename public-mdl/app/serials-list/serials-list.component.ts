import {Component, OnInit, OnDestroy} from "@angular/core";
import {SerialService} from "../serial/serial.service";
import {ActivatedRoute, Router} from "@angular/router"
import {ISerial} from "../serial/serial";
import {Subscription} from "rxjs";
import {FormGroup, FormControl, FormBuilder} from "@angular/forms";
@Component({
    templateUrl:'./app/serials-list/serials-list.component.html',
    styleUrls:['./app/serials-list/serials-list.component.css']
})
export class SerialsListComponent implements OnInit, OnDestroy {
    page: number = 1;
    private resultsOnPage: number = 30;
    serials: ISerial[] = null;
    private sub: Subscription;
    private _searchText: string;

    public form: FormGroup;
    public searchString = new FormControl('');

    get searchText():string{
        return this._searchText;
    }

    set searchText(text: string){
        this._searchText = text;
    }

    constructor(private _route: ActivatedRoute,
                private _router : Router,
                private _formBuilder : FormBuilder,
                private _serialService: SerialService) {}

    fetchData(){
        this._serialService.getSerialsBriefly(this.resultsOnPage, (this.page - 1)*this.resultsOnPage)
            .then(serials => {
                if (serials.length === 0)
                    this._router.navigate(['/serials'])
                this.serials = serials;
                console.log(this.serials);
            })
    }

    getActorsShortened(actors: string):string{
        return actors.replace(/ \([\wА-Яа-я ]+\)/g,'').slice(0, 100).replace(/, [\wА-Яа-я ]+$/,' и другие. ');
    }

    getSerialUrl(serial: ISerial):string{
        return this._serialService.getSerialUrl(serial);
    }

    navigateToSerial(serial: ISerial){
        this._router.navigate([this.getSerialUrl(serial)]);
    }

    onSubmitString(form: FormGroup){
        console.log(form.value.searchString);
    }

    ngOnInit(){
        this.sub = this._route.params.subscribe(params => {
            if (params['page']){
                this.page = +params['page'];
                if (this.page <= 0)
                    return this._router.navigate(['/serials'])
            }
            this.fetchData();
        });
        this.form = this._formBuilder.group({
            'searchString': this.searchString
        });
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

}