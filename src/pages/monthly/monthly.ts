import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
  assignmentInfo: any;
  quizInfo: any;
  eventSource;
  lockSwipeToPrev = true;
  viewTitle;
  isToday: boolean;
  loading: any;
  calendar = {
      mode: 'month',
      currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private authService: AuthService, private webService: WebService,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
  }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad MonthlyPage');
//     this.getClassInfo();
//   }

  ionViewWillEnter(){
    this.myDate = moment().format();
    this.presentLoading();
      this.getMonthlyInfo();
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
      //console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        let start = moment(event.startTime).format('LLLL');
        let end = moment(event.endTime).format('LLLL');
        
        let alert = this.alertCtrl.create({
        title: '' + event.title,
        subTitle: event.matkul + '<br>From: ' + start + '<br>To: ' + end,
        buttons: ['OK']
        })
        alert.present();
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

  getMonthlyInfo(){

    //console.log(this.authService.nim);
    let req = {
      'nim' : this.authService.nim,
      'id_moodle' : this.authService.id_moodle
    }

    this.webService.post(this.webService.url + "get_data_monthly.php", JSON.stringify(req), null).subscribe(response => {
      //console.log(response["_body"]);
      let responseData = JSON.parse(response["_body"]);
      console.log(JSON.stringify(responseData))
      if(responseData){
        this.classInfo = responseData["class"];
        this.assignmentInfo = responseData["assignment"];
        this.quizInfo = responseData["quiz"];
        this.loadEvents();
        this.dismissLoading();
        //console.log(this.classInfo);
        //console.log(this.assignmentInfo);
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
            //console.log(element);
            var date = this.classInfo[idx]['tanggal'];
            //console.log(idx," ",date);
            var startTime = new Date(date +' '+ this.classInfo[idx]['jam_mulai']);
            var endTime = new Date(date +' '+ this.classInfo[idx]['jam_selesai']);
            events.push({
                title: 'Class ' + this.classInfo[idx]['nama_mk'],
                startTime: startTime,
                endTime: endTime,
                allDay: false,
                matkul: this.classInfo[idx]['nama_mk']
            });
        }

        if(this.assignmentInfo != null){
            for (let idx = 0; idx < this.assignmentInfo.length; idx++) {
                const element = this.assignmentInfo[idx];
                //console.log(this.assignmentInfo[idx]['startdate']);
                //console.log(idx);
                //isinya object object
                //var date = this.assignmentInfo[idx]['tanggal'];
                //console.log(idx," ",this.assignmentInfo[idx]['enddate']);
                var startTime = new Date(this.assignmentInfo[idx]['startdate']);
                var endTime = new Date(this.assignmentInfo[idx]['enddate']);
                events.push({
                    title: 'Assignment '+ this.assignmentInfo[idx]['name'],
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false,
                    matkul: this.assignmentInfo[idx]['nama_mk']
                });
            }
        }

        if(this.quizInfo != null){
            for (let idx = 0; idx < this.quizInfo.length; idx++) {
                const element = this.quizInfo[idx];
                //console.log(this.quizInfo[idx]['startdate']);
                //console.log(idx);
                //isinya object object
                //var date = this.assignmentInfo[idx]['tanggal'];
                //console.log(idx," ",this.quizInfo[idx]['enddate']);
                var startTime = new Date(this.quizInfo[idx]['startdate']);
                var endTime = new Date(this.quizInfo[idx]['enddate']);
                events.push({
                    title: 'Quiz '+ this.quizInfo[idx]['name'],
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false,
                    matkul: this.quizInfo[idx]['nama_mk']
                });
            }
        }
        
        return events;
    }

    test(){
        moment('2018-04-24 19:57:00', "YYYYMMDD").fromNow();
    }
}
