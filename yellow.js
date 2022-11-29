var w,h,g,el,my={}
var firstshapeTime;
var timeID;
var state;

function reactionPrime(){
    w=1500;
    h=500;
    clrs=["orange"];
    this.MAX=5;
    this.count=0;
    this.times=[];
    var s='';
    s+=`<div style="position:relative; max-width:${w}px;height:${h}px; border-radius: 10px; margin:auto; display:block; background-color: #00bfff; ">`;
    startStr='Klicka för att börja.';
    s+='<div id="value" style="height:10%; font:18px Verdana; color: whitesmoke; text-align: center;"></div>';
    s+='<div id="instru" style="height: 100%; font:18px Verdana; color: whitesmoke; background-color: #00bfff; border-radius: 10px; padding: 3%; transition: all linear 0.1s; cursor: pointer;"; onmousedown="toClick()">'+startStr+'</div>';
    s+='</div>';
    document.write(s);
    showColor('default');
    state='start';
}

function showColor(figureName) {
    var instru = document.getElementById('instru');
    switch(figureName) {
        case 'orange':
            instru.style.backgroundColor = "orange";
            break;
        case 'default':
            instru.style.backgroundColor = "#00bfff";
            break;
    }

}

function doFirstcolor() {
    var time=1500+Math.random()*2000;    
    timeID=setTimeout(
        function() {statusMachine('timeout');},
        time
    ); 
    document.getElementById('instru').innerHTML='Klicka när du ser orange';
    state='firstcolor';
}

function doCalculate() {
    firstshapeTime=performance.now();
    clearTimeout(timeID);
    showColor('orange');
    state='measure';
}

function doEarly() {
    document.getElementById("instru").innerHTML="För tidigt, klicka för att försöka igen";
    clearTimeout(timeID);
    showColor('default');
    state = 'tooearly';
}

function doResult() {
    var clickTime=performance.now();
    elapsed=(clickTime-firstshapeTime)/1000;
    times.push(elapsed);
    document.getElementById("value").innerHTML=showResult();
    document.getElementById('instru').innerHTML="Bra jobbat! Klicka för nästa mätning";
    this.count++;
    showColor('default');
    if(this.count==this.MAX) {
        doFinish();
    } else {
        state='result';
    }
}

function doFinish() {
    document.getElementById('instru').innerHTML="Mätningen avklarad, tack för din medverkan!<br>"+showAverage();
}

function statusMachine(eventName){
    console.log('statusMachine(' + eventName + ')');
    switch(state){
        case 'start':
            if(eventName == 'click') {
                doFirstcolor();
            }
            break;
        case 'firstcolor':
            if(eventName == 'timeout') {
                doCalculate();
            } else if(eventName == 'click') {
                doEarly();
            }
            break;
        case 'tooearly':
            if(eventName == 'click') {
                doFirstcolor();
            }
            break;   
        case 'measure':
            if(eventName == 'click') {
                doResult();
            }
            break;
        case 'result':
            if(eventName == 'click') {
                doFirstcolor();
            }
            break;
        default:
    }
}

function toClick() {
    statusMachine('click');
}

function showResult(){
    var s='';
    var timesN=this.times.length;
    for(var i=0;i<timesN;i++) {
        if(i>0)s+=', ';
        s+=fmt(this.times[i])+'s';
    }
    return s;
}

function showAverage() {
    var s='';
    var timesN=this.times.length;
    var sum=0;
    for(var i=0;i<timesN;i++) {
        sum+=this.times[i];
    }
    var avg=sum/this.times.length;
    s+='Genomsnitt: '+fmt(avg)+' sec';
    return s;
}

function fmt(v){return Math.round(v*1000)/1000}

