import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastModule, ToastOptions } from "ng2-toastr/ng2-toastr";
import { NgSemanticModule } from 'ng-semantic';
import { L_SEMANTIC_UI_MODULE } from 'angular2-semantic-ui';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ClickOutsideModule } from 'ng2-click-outside';
import { CalendarModule } from 'primeng/primeng';

import { MomentModule } from 'angular2-moment';

import { AppComponent }   from './app.component';
import { MainHeaderComponent } from './home/main-header.component';
import { MainBodyComponent } from './home/main-body.component';
import { ChartComponent } from './chart/chart.component';
import { ClaimComponent } from './coding/claim/claim.component';
import { ClaimsComponent } from './coding/claims/claims.component';
import { CodingComponent } from './coding/coding.component';
import { ChartService } from './chart/chart.service';
import { DXCodesComponent } from './coding/dxCode/dxcodes.component';
import { CPTCodesComponent } from './coding/cptCode/cptcode.component';
import { MemberInfoComponent } from './coding/memberInfo/member-info.component';
import { CommentCannotReviewComponent } from './coding/cannotReview/comment-cannot-review.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RavDropdown, RavAccordion, RavCheckbox } from './shared/directives';

import { LoginComponent } from './login/login.component'

import { routing } from './app.routes'

import { AuthService } from './login/auth.service';
import { AuthGuard } from './login/auth-guard.service';
import { DashboardService } from './dashboard/dashboard.service'

import { SafePipe, ConvertNullToEmptyString } from './shared/shared.pipe';


let toastOptions = <ToastOptions> {
    toastLife: 4000,
    dismiss: 'auto',
    animate: 'flyRight',
    positionClass: 'toast-bottom-right'
};


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        ToastModule.forRoot(toastOptions),
        NgSemanticModule,
        L_SEMANTIC_UI_MODULE,
        MomentModule,
        NgIdleKeepaliveModule.forRoot(),
        ClickOutsideModule,
        CalendarModule
    ],
    declarations: [
        AppComponent,
        MainHeaderComponent,
        MainBodyComponent,
        ChartComponent,
        ClaimComponent,
        ClaimsComponent,
        CodingComponent,
        CommentCannotReviewComponent,
        DXCodesComponent,
        CPTCodesComponent,
        MemberInfoComponent,
        LoginComponent,
        SafePipe,
        ConvertNullToEmptyString,
        DashboardComponent,
        RavDropdown,
        RavAccordion,
        RavCheckbox
    ],
    providers: [
        AuthService,
        AuthGuard,
        DashboardService
    ],
    bootstrap: [
        AppComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule { }