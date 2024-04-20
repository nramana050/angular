// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatMenu } from '@angular/material/menu';
// import { Router } from '@angular/router';
// import { SrmService } from '../../../features/srm/srm.service';
// import { Chat } from '../../../features/srm/go-to-chat/srm-chat.interface';
// import { ChatNotificationMatBadgeService } from "./chatnotification-matbadge.service";

// @Component({
//   selector: 'app-chatnotification',
//   templateUrl: './chatnotification.component.html',
//   styleUrls: ['./chatnotification.component.scss'],
//   exportAs: 'menuChatNotificationComponent',
// })
// export class ChatnotificationComponent implements OnInit {
//   @ViewChild(MatMenu , {static:false}) menu: MatMenu;
  
//   showPanel: boolean = false;
//   protected userId: number;
//   public messageToName;
//   selectedItem: any;
//   chatDataSource;
//   messagesDataSource;
//   chatItems: Chat[] = [];
//   public chat;
//   subscription: any;
//   loadChatSubscription: any;

//   constructor(
//     private readonly router: Router,
//     private readonly srmChatService: SrmService,
//     private readonly chatNotificationMatBadgeService: ChatNotificationMatBadgeService,
//   ) { }

//   ngOnInit() {
//     this.userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
//     this.loadQuickView();
//     this.loadChatSubscription = this.chatNotificationMatBadgeService.getLoadQuick()
//     .subscribe(flag => {
//       if(flag){
//         this.loadQuickView();
//       }
//     });

//     this.subscription = this.chatNotificationMatBadgeService.getChat()
//       .subscribe(chatId => {
//         this.chatDataSource.forEach(chat => {
//           if(chat.chatId === chatId){
//             chat.isRead = true;
//           }
//         });
//     });
//   }

//   loadQuickView(){
//     this.srmChatService.getTopThreeReceivedChat().subscribe(data => {
//       const dataSource = data.filter(chat => chat.status === 'Received');
//       this.chatDataSource = new Array();
//       let index = 1;
//       dataSource.forEach(chatObj => {
//         if(index <= 3){
//           if (this.userId === chatObj.messageFromId) {
//             chatObj.chatFrom = chatObj.messageToName;
//           } else if (this.userId === chatObj.messageToId) {
//            chatObj.chatFrom = chatObj.messageFromName;
//           }
//           this.chatDataSource.push(chatObj);
//         }
//         index ++;
//       });
//     });
//   }

//   getShortName(fullName) {
//     return fullName.split(' ').map(n => n[0]).join('');
//   }

//   goToChatInbox(chat) {
//     this.showPanel = false;
//     chat.isRead=true;
//     localStorage.setItem('chatId', chat.chatId );
//     this.router.navigate(['/srm/go-to-chat'], { queryParams : { active: chat.chatId }});
//   }
// }
