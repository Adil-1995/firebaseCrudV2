import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  searchTerm: string;
  listData: MatTableDataSource<any>;
   searchKey: string;
  // tslint:disable-next-line:no-inferrable-types
  isEditable: boolean = false;
  productList: Product[];
  closeResult = '';
  GivenDate = '2021-01-01';
  constructor(
    public productService: ProductService,
    // private toastr: ToastrService,
    // private modalService: NgbModal
  ) {}

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
      text: 'You won\'t be able to revert this!',
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

  //////////////// product //////
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

  // applyFilter(filterValue: string){
  //   this.listData.filter = filterValue.trim().toLocaleLowerCase();

  // }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }




}

