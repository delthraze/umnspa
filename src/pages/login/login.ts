import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../service/AuthService';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  tabsPage = TabsPage;
  LoginForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private app:App,
    private menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter(){
    console.log("disabled");
    this.menuCtrl.close();
    this.menuCtrl.enable(false, 'myMenu');
    this.menuCtrl.swipeEnable(false, 'myMenu');
  }

  ngOnInit(){
    this.initializeForm()
  }

  initializeForm(){
    this.LoginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit(){   
    let x = this.authService.login(this.LoginForm.value.email, this.LoginForm.value.password, ()=>{this.app.getRootNav().setRoot(TabsPage); console.log("Kepangil")});
    //console.log(x);
  }

}
