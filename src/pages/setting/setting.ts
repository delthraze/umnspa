import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Toggle, LoadingController, App } from 'ionic-angular';
import { AuthService } from '../../service/AuthService';
import { LoginPage } from '../login/login';
import { SettingsService } from '../../service/SettingService';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private authService: AuthService, private settingService: SettingsService,
  private loadingCtrl: LoadingController, private app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  onToggle(toggle: Toggle) {
    this.settingService.setNotification(toggle.checked);
  }

  isChecked() {
    return this.settingService.isNotification();
  }

  logout(){
    this.presentLoading();
    this.authService.logout(()=>{this.app.getRootNav().setRoot(LoginPage); console.log("Logout dah")});
    this.dismissLoading();
    console.log("logout");
    //this.navCtrl.setRoot(LoginPage);
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

    // setTimeout(() => {
    //   loading.dismiss();
    // }, 5000);
  }

  dismissLoading(){
    this.loading.dismiss();
  }

}
