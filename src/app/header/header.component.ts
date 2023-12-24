import { AuthService } from '../login/auth.service';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import * as feather from 'feather-icons'; // Remove the unused import

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  logged: boolean = false;
  @ViewChild('header') header!: ElementRef;

  constructor(private authVerify: AuthService, private router: Router) {
    this.header = new ElementRef('header');
  }

  ngOnInit() {
    this.logged = this.authVerify.verifyLogin();
  }

  ngAfterViewInit() {
    feather.replace();
  }

  @HostListener('window:scroll')
  windowScroll() {
    if (window.scrollY > 80) {
      this.header.nativeElement.classList.add('sticky');
      console.log("sticky");
    } else {
      this.header.nativeElement.classList.remove('sticky');
    }
  }

  logout() {
    this.authVerify.logout();
    this.router
      .navigateByUrl('/login', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/home']);
      });
  }
}