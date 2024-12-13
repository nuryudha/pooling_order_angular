import { Component, OnInit } from '@angular/core';

import { AppsService } from 'src/app/services/apps.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InternalSales } from 'src/app/models/internal-sales.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

declare let CryptoJS: any;

@Component({
  selector: 'app-internal-sales',
  templateUrl: './internal-sales.component.html',
  styleUrls: ['./internal-sales.component.css'],
})
export class InternalSalesComponent implements OnInit {
  authUser: any;
  noListSales: boolean = false;

  internalSales: InternalSales[] = [];
  containParam: any;
  orderIdParam: any;
  headJobParam: any;
  officerJobParam: any;

  confirmSalesMessage: any;
  searchText: string = '';

  nik: string = '';
  nama: string = '';
  jabatan: string = '';

  internal_sales_head_job_code: string = '';
  internal_sales_head_job_desc: string = '';
  internal_sales_head_no: string = '';
  internal_sales_head_npk: string = '';
  internal_sales_head_id: string = '';
  internal_sales_head_name: string = '';
  internal_sales_hp_no: string = '';

  constructor(
    private appsService: AppsService,
    private router: Router,
    private ngx_spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.authUser = JSON.parse(localStorage.getItem('auth-user') || '{}');
  }

  ngOnInit() {
    this.containParam = JSON.parse(
      localStorage.getItem('containParam') || '{}'
    );
    this.orderIdParam = JSON.parse(
      localStorage.getItem('orderIdParam') || '{}'
    );
    this.getIamJobMap();
  }

  // get data mapping job
  getIamJobMap() {
    this.showLoading(true);

    let officerJobCodeParam = {
      officer_job_code_iam: this.containParam.officer_job_code,
    };
    // console.log(officerJobCodeParam);

    // this.appsService.getIamJobMap('?app=apiUrlMappingJob&endpoint=getIamJobMap', officerJobCodeParam, catchError(this.handleError.bind(this))).subscribe( result => {
    this.appsService
      .getIamJobMap(
        'mobile-job-mapping/getIamJobMap',
        officerJobCodeParam,
        catchError(this.handleError.bind(this))
      )
      .subscribe((result) => {
        // console.log(result);

        if (
          result.body.status == true &&
          result.body.data.length > 0 &&
          result.body.data != null
        ) {
          this.headJobParam = result.body.data[0].head_job_code_param;
          this.officerJobParam = result.body.data[0].officer_job_code_param;
          this.getInternalForce();
        } else {
          this.showLoading(false);
          Swal.fire({
            title: 'Oops..',
            text: `Mapping job gagal`,
            icon: 'error',
            confirmButtonColor: '#f7ad00',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed == true) {
              this.router.navigate(['/detail-order']);
            }
          });
        }
      });
  }

  // get list internal sales
  getInternalForce() {
    let internalForceParam = {
      sales_channel: '04',
      job_code: this.headJobParam,
      branch_code: this.containParam.branch_code,
      sales_type: '1',
      value: '',
    };
    // console.log(internalForceParam);

    // this.appsService
    //   .getInternalForce(
    //     '?app=apiUrlInternalSalesForce&endpoint=getInternalForce',
    //     internalForceParam,
    //     catchError(this.handleError.bind(this))
    //   )
    this.appsService
      .getInternalForce(
        'internal-sales/getInternalForce',
        internalForceParam,
        catchError(this.handleError.bind(this))
      )
      .subscribe((result) => {
        // console.log(result);

        if (
          result.body.status == true &&
          result.body.data.length > 0 &&
          result.body.data != null
        ) {
          this.internalSales = result.body.data;
          this.showLoading(false);
          this.noListSales = false;
        } else {
          this.showLoading(false);
          Swal.fire({
            title: 'Oops..',
            text: `List internal sales kosong`,
            icon: 'error',
            confirmButtonColor: '#f7ad00',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed == true) {
              this.noListSales = true;
            }
          });
        }
      });
  }

  // salah satu list sales di klik
  listClicked(data: any) {
    // console.log(data);

    let jobDesc: string = '';
    if (data.empl_empl_job_code == 'CMH') {
      jobDesc = 'CREDIT MARKETING HEAD';
    } else if (data.empl_empl_job_code == 'BRH') {
      jobDesc = 'BUSINESS RELATIONSHIP HEAD';
    } else if (data.empl_empl_job_code == 'CRH') {
      jobDesc = 'CUSTOMER RELATION HEAD';
    } else {
      jobDesc = 'MUF';
    }

    console.log(data);

    this.nik = data.empl_no;
    this.nama = data.empl_name;
    this.jabatan = data.empl_empl_job_code;
    this.internal_sales_head_job_code = data.empl_empl_job_code;
    this.internal_sales_head_job_desc = jobDesc;
    this.internal_sales_head_no = data.empl_no;
    this.internal_sales_head_npk = data.empl_npk;
    this.internal_sales_head_id = data.empl_acc_nik;
    this.internal_sales_head_name = data.empl_name;
    this.confirmSalesMessage = `Memilih ${this.nik} - ${this.nama} - ${this.jabatan} sebagai Internal Sales Head ?`;
    Swal.fire({
      title: 'Apakah Anda yakin ?',
      width: 300,
      text: `${this.confirmSalesMessage}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f7ad00',
      cancelButtonColor: '#696969',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Iya',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed == true) {
        this.onClaim();
      }
    });
  }

  // proses claim / button claim clicked
  onClaim() {
    this.showLoading(true);

    let confirmParam = {
      order_id: this.orderIdParam.order_id,
      branch_code: this.authUser.branchCode,
      identitas_order: {
        internal_sales_force: [
          {
            internal_sales_type_code: '1',
            internal_sales_type_desc: 'INTERNAL SALES 1',
            internal_sales_job_code:
              this.officerJobParam != 'null' ? this.officerJobParam : '',
            internal_sales_job_desc:
              this.containParam.job_desc != 'null'
                ? this.containParam.job_desc
                : '',
            internal_sales_force_no:
              this.containParam.empl_no != 'null'
                ? this.containParam.empl_no
                : '',
            internal_sales_force_npk:
              this.containParam.empl_npk != 'null'
                ? this.containParam.empl_npk
                : '',
            internal_sales_force_id:
              this.containParam.nik != 'null' ? this.containParam.nik : '',
            internal_sales_force_desc:
              this.containParam.full_name != 'null'
                ? this.containParam.full_name
                : '',
            internal_sales_head_job_code:
              this.internal_sales_head_job_code != 'null'
                ? this.internal_sales_head_job_code
                : '',
            internal_sales_head_job_desc:
              this.internal_sales_head_job_desc != 'null'
                ? this.internal_sales_head_job_desc
                : '',
            internal_sales_head_no:
              this.internal_sales_head_no != 'null'
                ? this.internal_sales_head_no
                : '',
            internal_sales_head_npk:
              this.internal_sales_head_npk != 'null'
                ? this.internal_sales_head_npk
                : '',
            internal_sales_head_id:
              this.internal_sales_head_id != 'null'
                ? this.internal_sales_head_id
                : '',
            internal_sales_head_name:
              this.internal_sales_head_name != 'null'
                ? this.internal_sales_head_name
                : '',
            internal_sales_bank_code:
              this.containParam.empl_bank_code != 'null'
                ? this.containParam.empl_bank_code
                : '',
            internal_sales_bank_acc_no:
              this.containParam.empl_acc_no != 'null'
                ? this.containParam.empl_acc_no
                : '',
          },
        ],
      },
    };

    // console.log(confirmParam);

    // this.appsService
    //   .getClaimPoolingOrder(
    //     '?app=apiUrlClaim&endpoint=confirmPoolingOrder',
    //     confirmParam,
    //     catchError(this.handleErrorClaim.bind(this))
    //   )

    this.appsService
      .getClaimPoolingOrder(
        'claim-pooling-pub/confirmPoolingOrder',
        confirmParam,
        catchError(this.handleErrorClaim.bind(this))
      )
      .subscribe((res) => {
        // console.log(res);

        if (res.body.status != true && res.body.data == null) {
          this.showLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Opps..',
            text: `Proses claim gagal!`,
            confirmButtonColor: '#f7ad00',
            allowOutsideClick: false,
          });
        } else if (
          res.body.status == true &&
          res.body.data != null &&
          res.body.data.toLowerCase().includes('berhasil')
        ) {
          this.showLoading(false);
          Swal.fire({
            title: 'Diklaim',
            text: `Data berhasil diklaim`,
            icon: 'success',
            confirmButtonColor: '#f7ad00',
            allowOutsideClick: false,
          }).then(() => {
            this.trackingUpdatePoolingOrder();
            this.router.navigate(['pooling']);
          });
        } else {
          this.showLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Opps..',
            text: `Proses claim gagal!`,
            confirmButtonColor: '#f7ad00',
            allowOutsideClick: false,
          });
        }
      });
  }

  trackingUpdatePoolingOrder() {
    let parameterUpdate = {
      order_id: this.orderIdParam.order_id,

      internal_sales_type_code: '1',

      internal_sales_type_desc: 'INTERNAL SALES 1',

      internal_sales_job_code:
        this.officerJobParam != 'null' ? this.officerJobParam : '',

      internal_sales_job_desc:
        this.containParam.job_desc != 'null' ? this.containParam.job_desc : '',

      internal_sales_force_no:
        this.containParam.empl_no != 'null' ? this.containParam.empl_no : '',

      internal_sales_force_npk:
        this.containParam.empl_npk != 'null' ? this.containParam.empl_npk : '',

      internal_sales_force_id:
        this.containParam.nik != 'null' ? this.containParam.nik : '',

      internal_sales_force_desc:
        this.containParam.full_name != 'null'
          ? this.containParam.full_name
          : '',

      internal_sales_head_job_code:
        this.internal_sales_head_job_code != 'null'
          ? this.internal_sales_head_job_code
          : '',

      internal_sales_head_job_desc:
        this.internal_sales_head_job_desc != 'null'
          ? this.internal_sales_head_job_desc
          : '',

      internal_sales_head_no:
        this.internal_sales_head_no != 'null'
          ? this.internal_sales_head_no
          : '',

      internal_sales_head_npk:
        this.internal_sales_head_npk != 'null'
          ? this.internal_sales_head_npk
          : '',

      internal_sales_head_id:
        this.internal_sales_head_id != 'null'
          ? this.internal_sales_head_id
          : '',

      internal_sales_head_name:
        this.internal_sales_head_name != 'null'
          ? this.internal_sales_head_name
          : '',

      internal_sales_bank_code:
        this.containParam.empl_bank_code != 'null'
          ? this.containParam.empl_bank_code
          : '',

      internal_sales_bank_acc_no:
        this.containParam.empl_acc_no != 'null'
          ? this.containParam.empl_acc_no
          : '',

      internal_sales_hp_no:
        this.containParam.empl_hp_no != 'null'
          ? this.containParam.empl_hp_no
          : '',
    };

    console.log(parameterUpdate);
    // http://dealer-translator-nodejs-dev.apps.ocp4dev.muf.co.id/api/updateCMO
    this.appsService
      .postTrackingUpdatePooling(
        'api/updateCMO',
        parameterUpdate,
        catchError(this.handleErrorClaim.bind(this))
      )
      .subscribe((res) => {
        console.log('Response Update Pooling Order : ' + res);
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

  // handle error request
  handleError(error: HttpErrorResponse) {
    console.log(error);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      const waitPopUpDone = async () => {
        await this.toastErrorOnRequest();
        this.showLoading(false);
        this.router.navigate(['/detail-order']);
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
        this.router.navigate(['/detail-order']);
      };
      waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  // handle error request on claim
  handleErrorClaim(error: HttpErrorResponse) {
    console.log(error);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      const waitPopUpDone = async () => {
        await this.toastOnErrorClaim('claim');
        this.showLoading(false);
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
        await this.toastOnErrorClaim('claim');
        this.showLoading(false);
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

  // notification on claim getting error
  toastOnErrorClaim(proses: string) {
    return new Promise<void>((resolve, reject) => {
      this.toastr.error(
        `<h3><b>Whoops!..</b></h3>
        <b>Terjadi masalah pada server, on process : <b>"${proses}"</b>.</br>
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
