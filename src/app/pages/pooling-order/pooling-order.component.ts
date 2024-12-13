import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderId, PoolingOrder } from 'src/app/models/pooling-order.model';

import { AppsService } from 'src/app/services/apps.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-pooling-order',
  templateUrl: './pooling-order.component.html',
  styleUrls: ['./pooling-order.component.css'],
})
export class PoolingOrderComponent implements OnInit {
  authUser: any;
  serverProblem: boolean = false;

  poolingOrder: PoolingOrder[] = [];
  orderId: OrderId | undefined;
  orderIdParam: any;

  // variable from mobile url
  branch_code: string = '';
  officer_job_code: string = '';
  job_desc_code: string = '';
  job_desc: string = '';
  empl_no: string = '';
  empl_npk: string = '';
  empl_hp_no: string = '';
  nik: string = '';
  full_name: string = '';
  empl_bank_code: string = '';
  empl_acc_no: string = '';
  job_code: string = '';
  jobCodeIam: string = '';

  searchText: string = '';
  screening: string = '1';
  noDataExist: boolean = false;

  constructor(
    private appsService: AppsService,
    private router: Router,
    private route: ActivatedRoute,
    private ngx_spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    localStorage.removeItem('containParam');
    localStorage.removeItem('orderIdParam');
    this.authUser = JSON.parse(localStorage.getItem('auth-user') || '{}');
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.getIamJobMap();
      this.authUserDetail();
    } catch (error) {
      console.error('Error saat menjalankan getIamJobMap:', error);
    }
  }

  tabActive(data: any) {
    switch (data.index) {
      case 0:
        this.screening = '1';
        break;
      case 1:
        this.screening = '2';
        break;
      case 2:
        this.screening = '3';
        break;
      default:
        this.screening = '1';
        break;
    }
    this.getPoolingOrder();
  }

  getIamJobMap(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.showLoading(true);

      let officerJobCodeParam = {
        officer_job_code_iam: this.authUser.jobCode,
      };

      this.appsService
        .getIamJobMap(
          'mobile-job-mapping/getIamJobMap',
          officerJobCodeParam,
          catchError(this.handleErrorPoolingOrder.bind(this))
        )
        .subscribe({
          next: (result) => {
            if (
              result.body.status == true &&
              result.body.data.length > 0 &&
              result.body.data != null
            ) {
              this.jobCodeIam = result.body.data[0].officer_job_code_param;
              resolve();
            } else {
              this.showLoading(false);
              Swal.fire({
                title: 'Oops..',
                text: `Mapping job gagal`,
                icon: 'error',
                confirmButtonColor: '#f7ad00',
                allowOutsideClick: false,
              }).then(() => {
                this.router.navigate(['/detail-order']);
              });
              reject('Mapping job gagal');
            }
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  authUserDetail() {
    this.branch_code = this.authUser.branchCode;
    this.officer_job_code = this.authUser.jobCode;
    this.job_desc = this.authUser.jobDesc;
    this.empl_no = this.authUser.emplNo;
    this.empl_npk = this.authUser.emplNpk;
    this.empl_hp_no = this.authUser.emplHpNo;
    this.nik = this.authUser.nik;
    this.full_name = this.authUser.fullName;
    this.empl_bank_code = this.authUser.emplBankCode;
    this.empl_acc_no = this.authUser.emplAccNo;
    this.job_code = this.authUser.jobCode;

    // disable on production
    let color = 'color:#32CD32; font-weight: bold;';
    console.log(
      `\n%cBranch Code : ${this.branch_code}` +
        `\n%cOfficer Job Code : ${this.officer_job_code}` +
        `\n%cJob Desc : ${this.job_desc}` +
        `\n%cJob Code : ${this.job_code}` +
        `\n%cEmpl No : ${this.empl_no}` +
        `\n%cEmpl Npk : ${this.empl_npk}` +
        `\n%cEmpl Hp No : ${this.empl_hp_no}` +
        `\n%cNIK : ${this.nik}` +
        `\n%cFull Name : ${this.full_name}` +
        `\n%cEmpl Bank Code : ${this.empl_bank_code}` +
        `\n%cEmpl Acc No : ${this.empl_acc_no}`,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color
    );

    let containParam = {
      branch_code: this.branch_code,
      officer_job_code: this.officer_job_code,
      job_desc: this.job_desc,
      job_code: this.job_code,
      empl_no: this.empl_no,
      empl_npk: this.empl_npk,
      empl_hp_no: this.empl_hp_no,
      nik: this.nik,
      full_name: this.full_name,
      empl_bank_code: this.empl_bank_code,
      empl_acc_no: this.empl_acc_no,
    };

    localStorage.setItem('containParam', JSON.stringify(containParam));
    this.getPoolingOrder();
  }

  public getPoolingOrder(): void {
    this.showLoading(true);

    let parameter = {
      branch_code: this.branch_code,
      screening: this.screening,
      job_code: this.jobCodeIam,
    };
    // this.appsService.getPoolingOrder('?app=apiUrlPoolingOrder&endpoint=getAllDataTodoList', parameter, catchError(this.handleErrorPoolingOrder.bind(this))).subscribe( result => {
    this.appsService
      .getPoolingOrder(
        'todolist-pooling-order/getAllDataTodoList',
        parameter,
        catchError(this.handleErrorPoolingOrder.bind(this))
      )
      .subscribe((result) => {
        // console.log(result);

        if (
          result.body.status == true &&
          result.body.data.length > 0 &&
          result.body.data != null
        ) {
          this.poolingOrder = result.body.data;
          this.noDataExist = false;
          this.showLoading(false);
        } else if (
          result.body.status == false ||
          result.body.data.length < 1 ||
          result.body.data == null
        ) {
          this.noDataExist = true;
          this.showLoading(false);
        } else {
          this.noDataExist = true;
          this.showLoading(false);
        }
      });
  }

  reloadWhenNoDataAvailable() {
    window.location.reload();
  }

  onDetailOrder(data: any) {
    this.orderId = data.order_id;
    let orderIdParam = {
      order_id: this.orderId,
      screening: this.screening,
    };
    localStorage.setItem('orderIdParam', JSON.stringify(orderIdParam));
    this.router.navigate(['/detail-order']);
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

  // handle error request data pooling order
  handleErrorPoolingOrder(error: HttpErrorResponse) {
    console.log(error);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      const waitPopUpDone = async () => {
        await this.toastErrorOnRequest(error);
        this.showLoading(false);
        this.serverProblem = true;
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
        this.serverProblem = true;
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
