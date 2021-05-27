import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AfterViewInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  searchTerm: string;
  listData: MatTableDataSource<any>;
  searchKey: string;
  isEditable: boolean = false;
  productList: Product[];
  closeResult = '';
  GivenDate = '2021-01-01';

  page_size: number = 10;
  page_number: number = 1;
  pageSizeOption = [5, 10, 20, 100];

  constructor(public productService: ProductService) {}

  // tslint:disable-next-line:typedef
  ngOnInit() {
    return this.productService
      .getProducts()
      .snapshotChanges()
      .subscribe((item) => {
        this.productList = [];
        item.forEach((element) => {
          // tslint:disable-next-line:prefer-const
          let x = element.payload.toJSON();
          // tslint:disable-next-line:no-string-literal
          x!['$key'] = element.key;
          this.productList.push(x as Product);
        });
      });
  }

  // tslint:disable-next-line:member-ordering
  onEdit(product: Product) {
    this.isEditable = true;
    this.productService.selectedProduct = Object.assign({}, product);
  }

  onDeletet($key: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct($key);
        Swal.fire('Deleted!', 'Your Product has been deleted.', 'success');
      }
    });
  }
  onSubmit(productForm: NgForm) {
    if (productForm.value.$key == null) {
      this.productService.insertProduct(productForm.value);
      Swal.fire(
        'Product has beed inserted!',
        'You clicked the button!',
        'success'
      );
      // tslint:disable-next-line:curly
    } else this.productService.updateProduct(productForm.value);
    this.resetForm(productForm);
  }

  resetForm(productForm?: NgForm) {
    if (productForm != null) {
      productForm.reset();
      this.productService.selectedProduct = new Product();
    }
  }

  handlePage(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  firstDate = moment().subtract(2, 'days').calendar();


  checkDate() {

    console.log("Moment date is :" + this.firstDate);

    var ToDate = new Date();
    console.log(ToDate);
    var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
    console.log(OneDay);


    let expiredDate = this.productList[1].fechaCaducidad;

    console.log('mi fecha de  producto es :' + expiredDate);

    var res =
      new Date(this.productList[1].fechaCaducidad).getTime() -
      new Date(OneDay).getTime() ;
    if (res) {
      alert('my date is less than today');
    } else {
      alert('Product has been ended');
    }

  }
}
