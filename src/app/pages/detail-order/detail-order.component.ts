import { Component, OnInit } from '@angular/core';
import {
  DetailCustomer,
  DetailKendaraan,
  ObjectHeader,
  StrukturKredit,
} from 'src/app/models/detail-order.model';

import { AppsService } from 'src/app/services/apps.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

declare let CryptoJS: any;

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css'],
})
export class DetailOrderComponent implements OnInit {
  showPage: boolean = false;

  containParam: any;
  orderIdparam: any;
  screening: any;

  objHeader?: ObjectHeader;
  detailCustomer?: DetailCustomer;
  detailKendaraan?: DetailKendaraan;
  strukturKredit?: StrukturKredit;

  constructor(
    private appService: AppsService,
    private router: Router,
    private ngx_spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.orderIdparam = JSON.parse(
      localStorage.getItem('orderIdParam') || '{}'
    );
    this.screening = this.orderIdparam.screening;

    this.containParam = JSON.parse(
      localStorage.getItem('containParam') || '{}'
    );
    this.getDetailOrder();
  }

  getDetailOrder() {
    this.showLoading(true);
    let parameter = {
      order_id: this.orderIdparam.order_id,
    };

    // this.appService.getDetailPoolingOrder('?app=apiUrlDetail&endpoint=getDetailPoolingOrder', parameter, catchError(this.handleError.bind(this))).subscribe(
    this.appService
      .getDetailPoolingOrder(
        'detail-pooling-order/getDetailPoolingOrder',
        parameter,
        catchError(this.handleError.bind(this))
      )
      .subscribe((res) => {
        console.log(res);

        if (res.body.status == true && res.body.data != null) {
          this.detailCustomer = res.body.data.detail.debitur.personal;
          this.detailKendaraan = res.body.data.detail.object_pembiayaan;
          this.strukturKredit = res.body.data.detail.object_pembiayaan;
          this.objHeader = res.body.data;
          this.showLoading(false);
          this.showPage = true;
        } else {
          this.showLoading(false);
          Swal.fire({
            title: 'Oops..',
            text: `Gagal peroleh detail order`,
            icon: 'error',
            confirmButtonColor: '#f7ad00',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed == true) {
              this.showLoading(false);
              this.cancelClicked();
            }
          });
        }
      });
  }

  nextClicked() {
    this.router.navigate(['/claim-page']);
  }

  cancelClicked() {
    this.router.navigate(['pooling']);
  }

  // untuk encrypt kembali data lemparan mobile
  encryptAgain(wantToEncrypt: any) {
    function base64ToHexFunc(data: any) {
      const encodedData = atob(data);
      let result = '';
      for (let i = 0; i < encodedData.length; i++) {
        const hex = encodedData.charCodeAt(i).toString(16);
        result += hex.length === 2 ? hex : '0' + hex;
      }
      return result;
    }

    let key = '12345abc67890def';
    let iv = 'abc12345def67890';

    let ivWA = CryptoJS.enc.Utf8.parse(iv);
    let keyWA = CryptoJS.enc.Utf8.parse(key);

    let encryptedCP = CryptoJS.AES.encrypt(wantToEncrypt, keyWA, { iv: ivWA });
    let ciphertext = base64ToHexFunc(encryptedCP.toString());
    // console.log("Encrypt  : " + ciphertext);

    return ciphertext;
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

  // handle error request
  handleError(error: HttpErrorResponse) {
    console.log(error);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      const waitPopUpDone = async () => {
        await this.toastErrorOnRequest(error);
        this.showLoading(false);
        this.cancelClicked();
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
        await this.toastErrorOnRequest(error);
        this.showLoading(false);
        this.cancelClicked();
      };
      waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  // notification when request getting error
  toastErrorOnRequest(error: any) {
    return new Promise<void>((resolve, reject) => {
      this.toastr.error(
        `<h3><b>Whoops!..</b></h3>
        <b>Terjadi masalah pada server</br>
        <b>Silahkan coba beberapa saat lagi.`,
        '',
        {
          timeOut: 3000,
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
      }, 3000);
    });
  }
}
