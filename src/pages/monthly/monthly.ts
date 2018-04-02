import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../service/AuthService';
import { WebService } from '../../service/WebService';
import * as moment from 'moment';

/**
 * Generated class for the MonthlyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-monthly',
  templateUrl: 'monthly.html',
})
export class MonthlyPage {
    myDate: String = new Date().toISOString();
  classInfo: any;
  eventSource;
  viewTitle;
  isToday: boolean;
  calendar = {
      mode: 'month',
      currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService, private webService: WebService) {
  }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad MonthlyPage');
//     this.getClassInfo();
//   }

  ionViewWillEnter(){
    this.myDate = moment().format();
      this.getClassInfo();
      //this.loadEvents();
  }

  loadEvents() {
    //this.eventSource = this.createRandomEvents();
    this.eventSource = this.generateInfo();
  }

  onViewTitleChanged(title) {
      this.viewTitle = title;
  }

  onEventSelected(event) {
      console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  today() {
      this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }

  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }

  getClassInfo(){

    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim
    }

    this.webService.post("http://localhost/umnspa/get_class_monthly.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.classInfo = responseData;
        this.loadEvents();
        //console.log(this.classInfo);
      }
    }, error =>{
    })

  }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    markDisabled = (date:Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    generateInfo() {
        var events = [];
        for (let idx = 0; idx < this.classInfo.length; idx++) {
            const element = this.classInfo[idx];
            console.log(element);
            var date = this.classInfo[idx]['tanggal'];
            console.log(idx," ",date);
            var startTime = new Date(date +' '+ this.classInfo[idx]['jam_mulai']);
            var endTime = new Date(date +' '+ this.classInfo[idx]['jam_selesai']);
            events.push({
                title: this.classInfo[idx]['kode_mk'],
                startTime: startTime,
                endTime: endTime,
                allDay: false
            });
        }
        
        return events;
    }
}
