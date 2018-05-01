import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  userInfo = {
    nama: "",
    nim: "",
    prodi: "",
    angkatan: "",
    level: "",
    title: "",
    point: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private webService: WebService, private authService: AuthService) {
    
  }

  ionViewWillEnter(){
    console.log('tes');
    this.getUserInfo();
    this.getBackground();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorePage');
  }

  getBackground(){
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post(this.webService.url + "get_background.php", JSON.stringify(req), null).subscribe(response => {
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.storeInfo = responseData;
        
      }
    }, error =>{
    })
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
        
      }
    }, error =>{
    })

}

  buyBackground(background){
    swal({
      title: "Are you sure?",
      text: "Are you sure want to buy this background?",
      icon: 'warning',
      buttons: ["Cancel", "Yes!"],
    })
    .then(willDelete => {
      if (willDelete) {
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
          swal("Purchase Completed!", "You successfully buy new background", "success");
        }, error =>{
          swal("Unsuccessful", "Please try again", "failed");
        })        
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

}

