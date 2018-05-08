import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WebService } from '../../service/WebService';
import { AuthService } from '../../service/AuthService';

/**
 * Generated class for the StorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage {
  storeInfo: any;
  loading: any;
  userInfo = {
    nama: "",
    nim: "",
    prodi: "",
    angkatan: "",
    level: "",
    title: "",
    point: ""
  };
  bgImage = "../assets/background/basket.png";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private webService: WebService, private authService: AuthService,
  private loadingCtrl: LoadingController) {
    
  }

  ionViewWillEnter(){
    //console.log('tes');
    this.getUserInfo(null, false);
    this.getBackground(null, false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorePage');
  }

  getBackground(refresher, isRefresh){
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_background.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.storeInfo = responseData;
        if (!isRefresh) this.dismissLoading();
        else {
          refresher.complete();
        }
      }
    }, error =>{
    })
  }

  getUserInfo(refresher, isRefresh){
    if (!isRefresh) this.presentLoading();

    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_user_data.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.userInfo = responseData[0];
      }
    }, error =>{
    })

  }

  test(bg){
    console.log(bg.price); 
    console.log('point',this.userInfo['point']);  
  }

  buyBackground(background, point){
    swal({
      title: "Are you sure?",
      text: "Are you sure want to buy this background?",
      icon: 'warning',
      buttons: ["Cancel", "Yes!"],
    })
    .then(willDelete => {
      if (willDelete) {
        this.presentLoading();
        console.log(point - background.price);
        if((point - background.price) >= 0){
          let req = {
            'nim' : this.authService.nim,
            'id_background' : background.id,
            'price' : background.price
          }
          this.webService.post(this.webService.url + "update_background.php", JSON.stringify(req), null).subscribe(response => {
            let responseData = JSON.parse(response["_body"]);
            console.log(JSON.stringify(responseData))
            if(responseData){
              //this.storeInfo = responseData;
              this.getUserInfo(null, false);
              this.getBackground(null, false);
            }
            swal("Purchase Complete!", "You successfully buy new background", "success");
          }, error =>{
            swal("Unsuccessful", "Please try again", "error");
          })
        }
        else if((point - background.price) < 0){
          swal("Unsuccessful", "Your point is not enough to buy this background", "error");
        }
        this.dismissLoading();
      }
    });
  }

  changeBackground(background){
    let req = {
      'nim' : this.authService.nim,
      'id_background' : background.id,
      'price' : background.price
    }

    this.webService.post(this.webService.url + "update_background.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        //this.storeInfo = responseData;
        
      }
    }, error =>{
    })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.getUserInfo(refresher, true);
    this.getBackground(refresher, true);
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

