import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as feather from 'feather-icons';
import { firstValueFrom } from 'rxjs';

const popMenu = trigger('popMenu', [
  state(
    'inactive',
    style({
      transform: 'translateY(-150%)',
    })
  ),
  state(
    'active',
    style({
      transform: 'translateY(0)',
      opacity: 1,
    })
  ),
  transition('* => active', animate('500ms ease-in')),
  transition('active => *', animate('700ms ease-out')),
]);
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [popMenu],
})
export class HeaderComponent implements OnInit {
  logged: Promise<boolean> = this.verifyLogin();
  menuState: string = 'inactive';
  cartView: boolean = false;
  cartQuantity: number = 0;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('toggleIcon') toggleIcon!: ElementRef;
  @ViewChild('mobileHeader') mobileHeader!: ElementRef;
  @ViewChild('home') home!: ElementRef;
  @ViewChild('products') products!: ElementRef;

  constructor(private authVerify: AuthService, private router: Router) {
    this.header = new ElementRef('header');
  }

  ngOnInit(){
    this.reloadQuantity();
  }

  async ngAfterViewInit() {
    feather.replace();
    this.scrollToTop();
  }

  @HostListener('window:scroll')
  menuScroll() {
    if (window.scrollY > 80) {
      this.header.nativeElement.classList.add('sticky');
    } else {
      this.header.nativeElement.classList.remove('sticky');
    }
  }

  async verifyLogin() {
    if (
      localStorage.getItem('token') != null &&
      localStorage.getItem('token') != undefined
    ) {
      const response = await firstValueFrom(
        this.authVerify.verifyToken(localStorage.getItem('token')!)
      );
      if ((response as any)['message'] == 'Acesso permitido!') {
        return true;
      }
    }
    return false;
  }

  logout() {
    this.authVerify.logout();
    this.router
      .navigateByUrl('/login', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/home']);
      });
  }

  toggleMenu() {
    if (window.innerWidth < 768) {
      this.menuState = this.menuState === 'active' ? 'inactive' : 'active';
      let svg = this.toggleIcon.nativeElement.children;
      svg[0].classList.toggle('hidden');
      svg[1].classList.toggle('hidden');
      if (svg[0].classList.contains('hidden')) {
        svg[1].classList.remove('hidden');
      }
    }
  }

  scrollTo(element: any) {
    element = document.getElementById(element);
    this.toggleMenu();
    if (element === null) {
      return;
    }
    if (element.offsetTop > 80) {
      this.header.nativeElement.classList.add('sticky');
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.scrollToTop();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleCart(){
    this.cartView = !this.cartView;
    this.reloadQuantity();
  }

  reloadQuantity(){
    if(localStorage.getItem('bag') != null){
      let bag = JSON.parse(localStorage.getItem('bag')!);
      this.cartQuantity = bag.length;
    }else{
      this.cartQuantity = 0;
    }
  }
}
