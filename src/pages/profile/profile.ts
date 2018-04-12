import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WebService } from '../../service/WebService';
import { AuthService } from '../../service/AuthService';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loadProgress = 0;
  exp_req = 0;
  userInfo: any;
  classInfo: any;
  jatah_absen = 3;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private webService:WebService, private authService: AuthService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    // this.getUserInfo();
    // this.getClassInfo();
    //console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter(){
    //this.presentLoading();
    this.getLevelInfo();
    this.getClassInfo();
  }

  getUserInfo(){

      //console.log(this.authService.nim);
      let req = {
        'nim' : this.authService.nim
      }

      this.webService.post(this.webService.url + "get_user_data.php", JSON.stringify(req), null).subscribe(response => {
        let responseData = JSON.parse(response["_body"]);
        //console.log(JSON.stringify(responseData))
        if(responseData){
          this.userInfo = responseData;
          //this.loadProgress = this.userInfo.exp;
          this.loadProgress = responseData[0]['exp'];
          //console.log("exp_req",this.exp_req);
          this.loadProgress = this.loadProgress/this.exp_req*100;
          //console.log("%an",this.loadProgress);
        }
      }, error =>{
      })

  }

  getClassInfo(){

    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_class_data.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      //console.log(JSON.stringify(responseData))
      if(responseData){
        this.classInfo = responseData;
        this.dismissLoading();
        //console.log(this.classInfo);
      }
    }, error =>{
    })

  }

  getLevelInfo(){

    let req = {
      'nim' : this.authService.nim
    }
    this.presentLoading();
    this.webService.post(this.webService.url + "update_level.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      //console.log("Asd",JSON.stringify(responseData))
      if(responseData){
        this.exp_req = responseData;
        this.getUserInfo();
        //console.log("exp",this.exp_req);
      }
    }, error =>{
    })

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
