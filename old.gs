/*
function doGet() {
  
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('出題くん')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function showSidebar() {
  const qS = nameOpen("question");
  
  var htmlOutput = HtmlService.createHtmlOutputFromFile('index');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function sendToHTML_question(){
  var QA=[];
  var usedIndex=[];
  var qS = nameOpen("question");
  var dataCnt = qS.getRange("J2").getValue();
  var qNum = randInt(dataCnt);
  
  QA[0]=qS.getRange(qNum+2,2).getValue(); // Q
  usedIndex[0]=qNum;
  QA[1]=qS.getRange(qNum+2,3).getValue(); // A
  for(var i=2;i<=4;i++){
    var curNum=randInt(dataCnt,usedIndex);
    QA[i]=qS.getRange(curNum+2,3).getValue(); // fake A
    usedIndex[i-1]=curNum;
  }
  QA[5]=qNum; // 問題番号
  return QA;
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

function test01(){
  //for(var i=0;i<10;i++)Logger.log(randInt(3,[1,2]));
  //addIncorrect(2);
}

function addCorrect(qNum){
  var qS = nameOpen("question");
  var correctRange = qS.getRange(qNum+2,5);
  correctRange.setValue(correctRange.getValue()+1);
}

function addIncorrect(qNum){
  var qS = nameOpen("question");
  var incorrectRange = qS.getRange(qNum+2,6);
  incorrectRange.setValue(incorrectRange.getValue()+1);
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


*/