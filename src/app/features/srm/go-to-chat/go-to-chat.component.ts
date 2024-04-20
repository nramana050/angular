import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { SrmService } from '../srm.service';
import { Chat } from './srm-chat.interface';
import { Message } from './srm-message.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatNotificationMatBadgeService } from "../../../home/topnav/chatnotification/chatnotification-matbadge.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-go-to-chat',
  templateUrl: './go-to-chat.component.html',
  styleUrls: ['./go-to-chat.component.scss']
})
export class GoToChatComponent implements OnInit {
  protected myDate: Date;
  userId: number;
  public messageToName;
  selectedItem: any;
  sortColumn = '';
  pageSize = 10;
  pageIndex = 0;
  filterBy = { 'keyword': '' };
  chatDataSource;
  messagesDataSource;
  chatItems: Chat[] = [];
  public chat;
  public isAllMessagesLoaded: boolean = false;
  for_mobile: boolean = false;
  conversationWithId: number;
  active;
  browserName = navigator.userAgent.split(')').reverse()[0].match(/(?!Gecko|Version|[A-Za-z]+?Web[Kk]it)[A-Z][a-z]+/g)[0];
  versionNumber: number;
  oldVersion: boolean;

  @ViewChild('mainScreen', {static:false}) elementView: ElementRef;
  viewHeight: number;
  ngOnDestroy(): void {
    this.pageIndex = 0;
    this.messagesDataSource = [];
    this.chatDataSource = [];
    this.chat = null;
    // this.chatNotificationMatBadgeService.emitChatFocus(false);
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly srmChatService: SrmService,
    private readonly chatNotificationMatBadgeService: ChatNotificationMatBadgeService,
    private readonly snack: MatSnackBar,
    private readonly sessionService: SessionsService) {
  }

  ngOnInit() {
    this.userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
    this.route.queryParams.subscribe(params => {
      this.active = params.active;
      // this.chatNotificationMatBadgeService.emitChatFocus(true);
      this.active ? this.getChatDisplay(+this.active) : this.getChatDisplay();
    });
    if(this.browserName === "Firefox") {
      this.versionNumber = parseInt(window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);
      if(this.versionNumber <= 80) {
        this.oldVersion = true;
      }
    }    
  }

  getChatDisplay(id?: number) {
    // this.chatNotificationMatBadgeService.emitLoadQuick(true);
    this.pageIndex = 0;
    this.messagesDataSource = [];
    this.chat = null;
    this.isAllMessagesLoaded = false;
    this.srmChatService.getAllChat().subscribe(data => { 
      this.chatDataSource = data;
      this.chatDataSource.forEach(chatObj => {
        if (this.userId === chatObj.messageFromId) {
          chatObj.chatFrom = chatObj.messageToName;
        } else if (this.userId === chatObj.messageToId) {
          chatObj.chatFrom = chatObj.messageFromName;
        }
      });
      if (data && data.length > 0) {
        this.chatDataSource.forEach(element => {
          if (element.chatId === id) {
            element.isChatActive = true;
          } else {
            element.isChatActive = false;
          }

        });

        const chatObject = id ? this.chatDataSource.find(obj => obj.chatId === id) : this.chatDataSource[0];
        chatObject.isChatActive = true;
        this.chat = chatObject;
        if(chatObject.conersationWith ==='SU') {
          this.chat.messageToName  = this.chat.messageToName
        }else{
          this.chat.messageToName = this.chat.messageToName
        }
        this.chat.messageFromName = this.chat.messageFromName
        this.loadMessages(chatObject);
      }
      // this.chatNotificationMatBadgeService.emitChatRead(true);
    });
  }

  loadMessages(chatObject) {
    const chatMessage = {
      chatId: chatObject.chatId,
      userId: this.userId
    };
    this.srmChatService.getAllMessages(this.pageSize, this.pageIndex, chatMessage).subscribe(messages => {
     if(chatObject.conersationWith === 'SU') {
      this.messageToName = this.chat.messageToName;
      this.conversationWithId = this.chat.messageToId;
     }else if (this.userId === this.chat.messageFromId) {
      this.messageToName = this.chat.messageToName
      this.conversationWithId = this.chat.messageToId;
     }else if (this.userId === this.chat.messageToId) {
        this.messageToName = this.chat.messageFromName;
        this.conversationWithId = this.chat.messageFromId;
      }
      this.messagesDataSource = messages.content;
      this.groupByDate();
     

      if (!this.chat.isRead) {
        this.srmChatService.readAllMessages(chatMessage).subscribe(data => {
          this.chat.isRead = true;
          // this.chatNotificationMatBadgeService.emitChat(this.chat.chatId);
        })
      }
      this.scrollToBottom();
    });
  }

  getShortName(fullName) {
    const nameInitials = fullName.split(' ').map(n => n[0])
    if (nameInitials.length === 3) {
      return `${nameInitials[0]}${nameInitials[2]}`;
    } else {
      return `${nameInitials[0]}${nameInitials[1]}`;
    }
  }

  onClickChat(chat, event) {
    
    this.router.navigate(['/srm/go-to-chat'], { queryParams : { active: chat.chatId }});
  }
  onClickChatList() {
    this.for_mobile = false;
  }
  scrolled(event: any): void {
    const offsetHeight = this.elementView.nativeElement.offsetHeight;
    const scrollHeight = this.elementView.nativeElement.scrollHeight;
    const scrollTop = this.elementView.nativeElement.scrollTop;
    const scrollCeil = Math.ceil(Math.abs(scrollTop));
    const scrollFloor = Math.floor(Math.abs(scrollTop));
    const diff = scrollHeight - offsetHeight;
    if (this.browserName === 'Firefox' && this.versionNumber <= 80) {
      this.olderVersionCode(scrollTop,diff); 
    } else if (this.browserName === 'Firefox' && this.versionNumber > 80)  {
      this.newerVersionCode(scrollTop,diff,scrollCeil);
    } else if(((scrollCeil <= diff) || (scrollFloor <= diff)) && (scrollTop === 0 || scrollCeil === diff)  && !this.isAllMessagesLoaded && this.chat) {
        this.loadMoreChats(scrollTop);
    }
  }

  olderVersionCode(scrollTop,diff) {
    if(!this.isAllMessagesLoaded && this.chat && scrollTop <= diff && scrollTop === 0) {
      this.loadMoreChats(scrollTop);
    } 
  }

  newerVersionCode(scrollTop,diff,scrollCeil) {
    if(!this.isAllMessagesLoaded && this.chat && scrollTop <= diff && scrollCeil === diff) {
      this.loadMoreChats(scrollTop);
    }
  }
  
  loadMoreChats(scrollTop) {
    this.pageIndex = this.pageIndex + 1;
    const chatMessage = {
      chatId: this.chat.chatId,
      userId: this.userId
    };
    this.srmChatService.getAllMessages(this.pageSize, this.pageIndex, chatMessage).subscribe(data => {
      if (data.content && data.content.length > 0) {
        data.content.forEach(element => {
          if(this.getMessageByMessageId(element.messageId).length === 0){
            this.messagesDataSource.push(element);
          }
        });
        this.groupByDate();
      } else {
        this.isAllMessagesLoaded = true;
      }
    });
    document.getElementById("messageBody").scrollTop = scrollTop + 10;
  }

  onClickExit() {
    this.router.navigate(['srm/new-chat']);
  }

  groupByDate() {
    let messageDate = null;
    let messageCount = 0;
    const length = this.messagesDataSource.length;
    this.messagesDataSource.forEach(message => {

      if (messageCount < length - 1) {
        messageDate = this.messagesDataSource[messageCount + 1].messageTimestamp;
        if (length > 1 && this.compairDates(messageDate, message.messageTimestamp)) {
          message.isSameDate = true;
        } else {
          message.isSameDate = false;
        }
      } else {
        message.isSameDate = false;
      }

      if (messageCount === length - 1) {
        message.isSameDate = false;
      }

      messageCount++;
    });

  }


  compairDates(fromDate, toDate) {
    const firstDate = new Date(Date.parse(fromDate));
    const secondDate = new Date(Date.parse(toDate));

    const firstYear = firstDate.getFullYear();
    const firstMonth = firstDate.getMonth();;
    const firstDay = firstDate.getDate();;

    const secondYear = secondDate.getFullYear();
    const secondMonth = secondDate.getMonth();
    const secondtDay = secondDate.getDate();

    if (firstYear === secondYear && firstMonth === secondMonth && firstDay === secondtDay) {
      return true;
    }
    return false;
  }

  onSubmit(message){
    const messageJson =  {
      messageText : message.value,
      messageToId : this.conversationWithId,
      conersationWith : this.chat.conersationWith
    }

    this.srmChatService.creatMessage(messageJson).subscribe(data => {
      if(data){
        const newArray = new Array();
        message.value = "";
        newArray.push(data);
        this.messagesDataSource = newArray.concat(this.messagesDataSource);
        this.srmChatService.getAllChat().subscribe(data => {
          this.chatDataSource = data;
          this.chatDataSource.forEach(chatObj => {
            if(chatObj.chatId === this.chat.chatId){
              chatObj.isChatActive= true;
            }
            if (this.userId === chatObj.messageFromId) {
              chatObj.chatFrom = chatObj.messageToName;
            } else if (this.userId === chatObj.messageToId) {
              chatObj.chatFrom = chatObj.messageFromName;
            }
          });
        });
        this.groupByDate();
        this.scrollToBottom();
      }
    },
    error => {
      this.snack.open(`${error.error.applicationMessage}`, 'Dismiss', { duration: 6000 });
    });
  }

  getMessageByMessageId(messageId){
    return this.messagesDataSource.filter(message => message.messageId === messageId);
  }

  getChatDataSource(){
    return this.chatDataSource;
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.elementView.nativeElement.scrollTop = this.elementView.nativeElement.scrollHeight;
      } catch (err) {}
    }, 0);
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
}
