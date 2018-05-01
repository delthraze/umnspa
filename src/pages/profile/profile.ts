import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { WebService } from '../../service/WebService';
import { AuthService } from '../../service/AuthService';
import { StorePage } from '../store/store';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';

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
  profileSettings:any = ProfileSettingsPage;
  loadProgress = 0;
  exp_req = 0;
  userInfo = {
    nama: "",
    nim: "",
    prodi: "",
    angkatan: "",
    level: "",
    title: "",
    point: ""
  };
  profileName: any;
  profileNIM : any;
  profileProdi : any;
  profileLevel : any;
  profileTitle : any;
  profilePoint : any;
  scheduleDay : any;
  classInfo: any;
  jatah_absen = 3;
  loading: any;
  bgColor: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private webService:WebService, private authService: AuthService,
    public loadingCtrl: LoadingController, private menuCtrl: MenuController) {
      
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
        console.log(JSON.stringify(responseData))
        if(responseData){
          this.userInfo = responseData[0];
          this.profileName = responseData[0]['nama'];
          this.profileNIM = responseData[0]['nim'];
          this.profileProdi = responseData[0]['prodi'];
          this.profileLevel = responseData[0]['level'];
          this.profileTitle = responseData[0]['title'];
          this.profilePoint = responseData[0]['point'];
          //this.loadProgress = this.userInfo.exp;
          this.loadProgress = responseData[0]['exp'];
          //console.log("exp_req",this.exp_req);
          this.loadProgress = Math.round(this.loadProgress/this.exp_req*100);
          console.log("%an",this.loadProgress);
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
      console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      
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

  openSettings(){
    this.navCtrl.push(this.profileSettings);
  }

  onLoad(page: any){
    this.navCtrl.setRoot(page);
    this.menuCtrl.close();
  }

}
