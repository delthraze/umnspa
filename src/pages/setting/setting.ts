import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Toggle, LoadingController, App } from 'ionic-angular';
import { AuthService } from '../../service/AuthService';
import { LoginPage } from '../login/login';
import { SettingsService } from '../../service/SettingService';
import { WebService } from '../../service/WebService';

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
  notif: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private authService: AuthService, private settingService: SettingsService,
  private loadingCtrl: LoadingController, private app:App,
  private webService: WebService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewWillEnter(){
    this.getStatus();
  }

  onToggle(toggle: Toggle) {
    this.settingService.setNotification(toggle.checked);
    //console.log(toggle.checked);
    if(toggle.checked ==  true){
      this.setStatus('ON');
    }
    else if(toggle.checked == false){
      this.setStatus('OFF');
    }
  }

  isChecked() {
    return this.settingService.isNotification();
  }

  getStatus(){
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_setting.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      //console.log(JSON.stringify(responseData))
      if(responseData){
        this.notif = responseData['notification'];
        console.log('ini',this.notif);
        if(this.notif == 'ON'){
          this.settingService.setNotification(true);
        }
        else if(this.notif == 'OFF'){
          this.settingService.setNotification(false);
        }
      }
    }, error =>{
      console.log(error);
    })
  }

  setStatus(status){
    //console.log("badge.id_bc",badge.id_bc);
    //console.log("badge.id_badges",badge.id_badge);
    let req = {
      'nim' : this.authService.nim,
      'notif' : status
    }

    console.log(req.notif);

    this.webService.post(this.webService.url + "update_setting.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      //console.log(JSON.stringify(responseData))
      if(responseData['success']==true){
        //this.getBadgeInfo();
        this.authService.notification = status;
        //console.log(this.authService.notification);
      }
    }, error =>{
      console.log(error);
    })

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
