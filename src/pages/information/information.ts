import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AboutUsPage } from '../about-us/about-us';
import { HowToUsePage } from '../how-to-use/how-to-use';

/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  aboutUsPage:any = AboutUsPage;
  howToUsePage:any = HowToUsePage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }

  onLoad(page: any){
    this.navCtrl.push(page);
  }

}
