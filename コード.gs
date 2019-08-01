function doGet(e) {
  var quiz = e.parameter["quiz"];

  var output = HtmlService.createTemplateFromFile("index");
  output.quiz=quiz;
  
  return output.evaluate()
    .setTitle('出題くん')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function showSidebar() {
  
  var output = HtmlService.createTemplateFromFile("index");
  output.quiz=undefined;
  
  output = output.evaluate();
  SpreadsheetApp.getUi().showSidebar(output);
}

function writeFormula(){
  var qS     = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();//アクティブシート
  var rowNum = qS.getLastRow()-2;
  qS.getRange(3,4,rowNum,1).setFormula('=iferror(indirect("E"&row())+indirect("F"&row()),0)');
  var correctList =qS.getRange(3,5,rowNum,2).getValues();
  for(var i=0;i<rowNum;i++){
    if(correctList[i][0]=="")correctList[i][0]=0;
    if(correctList[i][1]=="")correctList[i][1]=0;
  }
  qS.getRange(3,5,rowNum,2).setValues(correctList);
  qS.getRange(3,7,rowNum,1).setFormula('=iferror(indirect("E"&row())/indirect("D"&row()),0)');
}


function sendToHTML_qCnt(quizSht){
  var qS = nameOpen(quizSht);
  return qS.getRange("J2").getValue();
}

function sendToHTML_question(quizSht,usedIndexList,mode){
  var QAList=[];
  if(!usedIndexList)usedIndexList=[];
  var qS = nameOpen(quizSht);
  var dataCnt = qS.getRange("J2").getValue();
  var qNum;
  var Q;
  
  if(mode==1)qNum = randInt(dataCnt,usedIndexList);
  else       qNum = minQNum(quizSht,dataCnt,usedIndexList);
  Q=qS.getRange(qNum+2,2,1,6).getValues();
  
  QAList[0]=Q[0][0];   // Q
  QAList[1]=Q[0][1];   // A
  
  usedIndexList = []; //これ以下回答選択肢保存用に使用
  usedIndexList[0]=qNum;
  for(var i=2;i<=4;i++){
    var curNum=randInt(dataCnt,usedIndexList);
    QAList[i]=qS.getRange(curNum+2,3).getValue(); // fake A
    usedIndexList.push(curNum);
  }
  QAList[5]=qNum;      // 問題番号
  QAList[6]=Q[0][2];   // 出題数
  QAList[7]=Q[0][3];   // 正答数
  QAList[8]=Q[0][5];   // 正答率
  return QAList;
}

// 1以上i以下の一次行列rejectに存在しないrandomな整数を返す函数
// 1以上i以下の全整数がrejectされる場合は1を返す（rejectの各要素はかぶらないものとする）
function randInt(i,reject){
  if(reject&&reject.length>=i)return 1;
  var randomInt = Math.ceil(Math.random()*i);
  if(randomInt==0)randomInt=1;
  var flg=1;
  if(reject){
    while(flg==1){
      flg=0;
      for(i=0;i<reject.length;i++)if(randomInt==reject[i])flg=1;
      // Browser.msgBox("reject:"+reject+"   flg:"+flg+"   randomint:"+randomInt);
      if(flg==1)if((randomInt +=1)>reject.length+1)randomInt=1;
    }
  }
  return randomInt;
}

// 1以上i以下の問題番号の中からrejectに存在しない問題で正答率の一番低いものの問題番号を返す
// 1以上i以下の全整数がrejectされる場合は1を返す（rejectの各要素はかぶらないものとする）
function minQNum(quizSht,i,reject){
  var qS = nameOpen(quizSht);
  var correctRateList = qS.getRange(3,7,i,1).getValues();
  var flg;
  var min=3,minIndex;
  
  for(var j=0;j<reject.length;j++)correctRateList[reject[j]-1][0]=2;
  
  for(var j=1;j<=i;j++){
    if(correctRateList[j-1][0]<min){
      min      = correctRateList[j-1][0];
      minIndex = j;
      //Browser.msgBox(("  min:"+min+"   minIndex"+minIndex+"  \\n    clist:"+correctRateList));
    }
  }
  return minIndex;
}

function test01(){
  //for(var i=0;i<10;i++)Logger.log(randInt(3,[1,2]));
  //addIncorrect(2);
  
}

function addCorrect(quizSht,qNum){
  var qS = nameOpen(quizSht);
  var correctRange = qS.getRange(qNum+2,5);
  correctRange.setValue(correctRange.getValue()+1);
}

function addIncorrect(quizSht,qNum){
  var qS = nameOpen(quizSht);
  var incorrectRange = qS.getRange(qNum+2,6);
  incorrectRange.setValue(incorrectRange.getValue()+1);
}


function loadQuizList(){
  const ss =SpreadsheetApp.getActiveSpreadsheet();
  const sheetCnt = ss.getNumSheets();
  var sheet;
  var quizList=[];
  for(var i=0;i<sheetCnt;i++){
    sheet = ss.getSheets()[i];
    quizList.push(ss.getSheets()[i].getName());
  }
  Logger.log(quizList);
  return quizList;
}

function loadQuizSelectorHtml(){
  var quizList = loadQuizList();
  var quizSelectorHtml = "";
  //<input type="button" id="b1" value="" onclick="checkAns(this)"><br>
  for(var i=quizList.length-1;i>=0;i--){
    quizSelectorHtml += '<input type="button" value="'
    quizSelectorHtml += quizList[i];
    quizSelectorHtml += '" onclick="setQuizSht(this.value)"><br>';
  }
  Logger.log(quizSelectorHtml);
  return quizSelectorHtml;
}

//------------------------------------------------------------
//アクティブスプレッドシートのnameシートを開く函数
function nameOpen(name){
  try{
    const ss = SpreadsheetApp.getActiveSpreadsheet(); //アクティブスプレッドシートを開く->ss
    const sss = ss.getSheetByName(name);              //nameという名前のシートを開く->sss
  }catch(e){                                          //エラー発生時は表示
    Browser.msgBox("シートを開けませんでした");
  }
  return sss;
}




//idスプレッドシートのnameシートを開く函数
function Sopen(id,name){
  try{
    const ss = SpreadsheetApp.openById(id);           //idスプレッドシートを開く->ss
    const sss = ss.getSheetByName(name);              //nameシートを開く->sss
  }catch(e){                                          //エラー発生時は表示
    Browser.msgBox("シートを開けませんでした ： "+e.message);
  }
  return sss;
}


