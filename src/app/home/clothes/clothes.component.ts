
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ClothesService } from '../../services/clothes.service';
import { SwiperOptions } from 'swiper/types';
import * as feather from 'feather-icons';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-clothes',
  templateUrl: './clothes.component.html',
  styleUrls: ['./clothes.component.scss'],
})
export class ClothesComponent implements AfterViewInit, OnInit {
  clothID: string = this.activatedRoute.snapshot.paramMap.get('id')!;
  selectedColor: string = '';
  selectedSize: string = '';
  cloth: any = {};
  options: FormGroup = this.formBuilder.group({
    id : '',
    color: '',
    size: '',
    zipCode: '',
    });;

  filteredColors: any[] = [];

  constructor(
    private clothesService: ClothesService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngOnInit() {
    this.clothesService.getCloth(this.clothID).subscribe({
      next: (data) => {
        this.cloth = data;
        this.filteredColors = [...new Set(this.cloth.images.map((item: any) => item.color))]
      },
    });
  }

  ngAfterViewInit() {
    feather.replace();
  }

  index = 0;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-button',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
    },
    breakpoints: {},
  };

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectSize(color: string) {
    this.selectedSize = color;
  }

  searchZip() {
    let value = this.options.value.zipCode;
    console.log(value);
    this.clothesService.searchZipCode(value).subscribe({
      next: (data) => {
        console.log(data);
        console.log(data.results[value]);
        if(data.results[value] == undefined){
          alert('invalid Zip Code');
        }else if(data.results[value]/100 < 2){
          alert('Free Shipping');
        }else{
          alert('Shipping Cost: $' + data.results[value]/100);
        }
      },
    });
  }

  onSubmit() {
    this.options.patchValue({
      id: this.clothID,
    });
  }
}


