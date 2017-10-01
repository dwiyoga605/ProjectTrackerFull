import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NgProgressService} from 'ngx-progressbar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private translate: TranslateService, public progressService: NgProgressService) {
        translate.addLangs(['en', 'fr', 'ur', 'es']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|ur|es/) ? browserLang : 'en');
    }

}
