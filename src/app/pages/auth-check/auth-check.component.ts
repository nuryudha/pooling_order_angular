import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AppsService } from 'src/app/services/apps.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

declare let CryptoJS: any;

@Component({
  selector: 'app-auth-check',
  templateUrl: './auth-check.component.html',
  styleUrls: ['./auth-check.component.css'],
})
export class AuthCheckComponent implements OnInit {
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response',
    responseType: 'json',
  };

  tokenParameter: string = '';
  urlParameter: any;

  jobDesc: string = '';
  emplNo: string = '';
  emplNpk: string = '';
  emplBankCode: string = '';
  emplAccNo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private services: AppsService,
    private ngx_spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.getUrlParameter();
  }

  // get & decrypt data url
  getUrlParameter() {
    function decryptUrl(dataEncrypt: any) {
      let ciphertext = dataEncrypt;
      let key = '12345abc67890def';
      let iv = 'abc12345def67890';

      let ciphertextWA = CryptoJS.enc.Hex.parse(ciphertext);
      let ivWA = CryptoJS.enc.Utf8.parse(iv);
      let ciphertextCP = { ciphertext: ciphertextWA };
      let keyWA = CryptoJS.enc.Utf8.parse(key);

      let decrypted = CryptoJS.AES.decrypt(ciphertextCP, keyWA, { iv: ivWA });

      return decrypted.toString(CryptoJS.enc.Utf8);
    }

    this.tokenParameter = this.route.snapshot.params['token'];
    this.urlParameter =
      decryptUrl(this.route.snapshot.params['params']) == ''
        ? {}
        : JSON.parse(decryptUrl(this.route.snapshot.params['params']));
    // console.log('TOKEN : ', this.tokenParameter);
    // console.log('URL Parameter : ', this.urlParameter);

    this.httpOptions.headers = this.httpHeaders.set(
      'Authorization',
      `Bearer ${this.tokenParameter}`
    );

    switch (true) {
      case 'jobDesc' in this.urlParameter &&
        'emplNo' in this.urlParameter &&
        'emplNpk' in this.urlParameter &&
        'emplBankCode' in this.urlParameter &&
        'emplAccNo' in this.urlParameter &&
        'skeleton' in this.urlParameter &&
        this.tokenParameter != '':
        this.getDetailUser();
        break;
      default:
        this.router.navigate(['/unauthorized']);
        break;
    }
  }

  getDetailUser() {
    this.showLoading(true);
    // this.services.getDetailUser('?app=detailUser&endpoint=details', {}, this.httpOptions, catchError(this.handleErrorDetailUser.bind(this))).subscribe( result => {
    this.services
      .getDetailUser(
        'authentication/uaa-iam/user/details',
        {},
        this.httpOptions,
        catchError(this.handleErrorDetailUser.bind(this))
      )
      .subscribe((result) => {
        // console.log(result);

        if (result.body.status.responseCode == 200) {
          const authUser = {
            token: result.body.result.token,
            branchCode: result.body.result.userAccount.branchCode,
            jobCode: result.body.result.userAccount.jobCode,
            jobDesc: this.urlParameter.jobDesc,
            emplNo: this.urlParameter.emplNo,
            emplNpk: this.urlParameter.emplNpk,
            emplHpNo:
              result.body.result.iamResult.resultUserProfileHeader.hp_no,
            nik: result.body.result.userAccount.nik,
            fullName: result.body.result.userAccount.fullName,
            emplBankCode: this.urlParameter.emplBankCode,
            emplAccNo: this.urlParameter.emplAccNo,
            skeleton: this.urlParameter.skeleton,
          };
          // console.log(authUser);
          localStorage.setItem('auth-user', JSON.stringify(authUser));
          this.showLoading(false);
          this.router.navigate(['/pooling']);
        } else {
          this.showLoading(false);
          this.router.navigate(['/unauthorized']);
        }
      });
  }

  // toggle loading on screen
  showLoading(condition: boolean) {
    switch (true) {
      case condition:
        this.ngx_spinner.show();
        break;
      default:
        this.ngx_spinner.hide();
        break;
    }
    return condition;
  }

  // handle error request login
  handleErrorDetailUser(error: HttpErrorResponse) {
    console.log(error);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      const waitPopUpDone = async () => {
        await this.toastErrorOnRequest();
        this.showLoading(false);
        this.router.navigate(['/unauthorized']);
      };
      waitPopUpDone();
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      const waitPopUpDone = async () => {
        await this.toastErrorOnRequest();
        this.showLoading(false);
        this.router.navigate(['/unauthorized']);
      };
      waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  // notification when request getting error
  toastErrorOnRequest() {
    return new Promise<void>((resolve, reject) => {
      this.toastr.error(
        `<h3><b>Whoops!..</b></h3>
        Terjadi masalah saat get detail user.`,
        '',
        {
          timeOut: 2000,
          positionClass: 'toast-top-center',
          enableHtml: true,
          progressBar: true,
        }
      );
      setTimeout(() => {
        const shouldResolve = true;
        if (shouldResolve) {
          resolve();
        } else {
          reject('Error : something went wrong!');
        }
      }, 2000);
    });
  }
}
