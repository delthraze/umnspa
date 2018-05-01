import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { WebService } from '../../service/WebService';
import swal from 'sweetalert'
import { StorePage } from '../store/store';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  badgeInfo:any;
  profile = this.navParams.get('user');
  //gridd = {"1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png"};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private webService: WebService, private toastCtrl: ToastController) {
  }

  ngOnInit(){
    this.profile;
    this.getBadgeInfo(this.profile.nim);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
    console.log(this.profile);
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  getBadgeInfo(userData){
    //console.log(this.authService.nim);
    let req = {
      'nim' : userData
    }

    //console.log(req.nim);

    this.webService.post(this.webService.url + "get_user_badge.php", JSON.stringify(req), null).subscribe(response => {
      console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      //console.log(JSON.stringify(responseData))
      if(responseData){
        this.badgeInfo = responseData;
      }
    }, error =>{
      console.log(error);
    })
  }

}
