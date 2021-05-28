import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  searchTerm: string;
  searchKey: string;
  isEditable: boolean = false;
  productList: Product[];
  newProducts: any[] = [];
  show: boolean = true;
  page_size: number = 10;
  page_number: number = 1;
  pageSizeOption = [5, 10, 20, 100];

  constructor(public productService: ProductService,   private router: Router) {}

  ngOnInit() {
    return this.productService
      .getProducts()
      .snapshotChanges()
      .subscribe((item) => {
        this.productList = [];
        item.forEach((element) => {
          let x = element.payload.toJSON();
          x!['$key'] = element.key;
          this.productList.push(x as Product);
        });

        this.checkDate();
      });
  }
  toHome() {
    console.log("works");
    this.router.navigate(['/home']);
  }

  checkDate() {
    let startdate = moment().subtract(2, 'days').format('l');
    console.log('Moment date is :' + startdate);

    for (let i = 0; i < this.productList.length; i++) {
      var currentNumber = this.productList[i].fechaCaducidad;
      const isEqual = moment(currentNumber).isSame(startdate);
      if (isEqual) {
        this.newProducts.push(this.productList[i]);
      }
    }
    console.log(this.newProducts);
  }

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
    } else this.productService.updateProduct(productForm.value);
    this.resetForm(productForm);
    window.location.reload();
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
}
