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
    resultsOnPage: number = 15;
    serials: ISerial[] = null;
    private sub: Subscription;
    private subQuery: Subscription;
    totalSerialsCount: number;

    public form: FormGroup;
    public searchString = new FormControl('');

    constructor(private _route: ActivatedRoute,
                private _router : Router,
                private _formBuilder : FormBuilder,
                private _serialService: SerialService) {}

    fetchData(){
        this._serialService.getSerialsBriefly(this.resultsOnPage, (this.page - 1)*this.resultsOnPage, this.searchString.value)
            .then(response => {
                this.serials = response.serials;
                this.totalSerialsCount = response.totalCount;
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
        this.page = 1;
        this._router.navigateByUrl(`/serials/page/1?search=${this.searchString.value}`).then(() => {
            this.ngOnInit();
            //this.fetchData();
        });
    }

    goBack(){
        let url;
        if (this.searchString.value){
            url = `/serials/page/${this.page - 1}?search=${this.searchString.value}`
        }
        else url = `/serials/page/${this.page - 1}`;
        this._router.navigateByUrl(url).then(() => {
            this.ngOnInit();
        });
    }

    goForward(){
        let url;
        if (this.searchString.value){
            url = `/serials/page/${this.page + 1}?search=${this.searchString.value}`
        }
        else url = `/serials/page/${this.page + 1}`;
        this._router.navigateByUrl(url).then(() => {
            this.ngOnInit();
        });
    }

    ngOnInit(){
        this.form = this._formBuilder.group({
            'searchString': this.searchString
        });
        this.sub = this._route.params.subscribe(params => {
            if (params['page']){
                this.page = +params['page'];
                if (this.page <= 0)
                    return this._router.navigate(['/serials'])
            }
            this.subQuery = this._route.queryParams.subscribe(params => {
                if (params['search']){
                    this.searchString.patchValue(params['search']);
                }
                this.fetchData();
            });
        });
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
        this.subQuery.unsubscribe();
    }

}