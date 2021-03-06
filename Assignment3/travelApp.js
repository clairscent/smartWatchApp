

//Main function of travel app
var app = (function () {


    "use strict";
    var keyword = "";

    var radius;

    var pub = {};

    var display = [];
 
    var pageNum;   
    var rad=80;
    var clock_run;
    var map;
    var infoWindow;
    var service;

    //********************app to emulator interaface****************************//
    pub.mousecallback=function(mouseevent){
	var coordinates={x:mouseevent.x,y:mouseevent.y};
	if (mouseevent.swipeleft ) {   
            exit_menu();
        }
        else if (mouseevent.swiperight && pageNum==0 ) {
            showClock();
            }
        else if (mouseevent.swipeup || mouseevent.swipedown)
            update_thirdPage(mouseevent.swipeup ,mouseevent.swipedown);
        else{
            hastouchcoordinates(coordinates);            
            }

	};

    /********************menu changes operation*************************/
    //exit menu: 
    //    page4->page3->page2->page1
    //    page99->page1
    //    the order is reversed to the sequence of entering a new menu
    //    page99 is special as it contains a analog clock that translate coordinates
    //    and the clock is always running. So stop it firstly and recover states.   
    function exit_menu(){
            if(pageNum==1)
                start();
            else if(pageNum==2)
                firstPage();
            else if(pageNum==3)
                secondPage();
            else if(pageNum==4){
                thirdPage(display,parseInt(localStorage.getItem("result_index")));
                }
            else if(pageNum==99){
                clearInterval(clock_run);
                emulator.recoverstate();
                emulator.clearScreen();
                emulator.setup();
                start();
                }
        }


    // has touchcoordinates:
    //click event handler: based on the current pages,decide the next page and data collected from ui
    //
    //

    function hastouchcoordinates (touchcoordinates){

        var coordinates = emulator.coordinatesofEmulator(); 
        var width = emulator.width()-80;
        var height = emulator.height()/6;

        if(pageNum==0){
            if(touchcoordinates.y < height+90+coordinates.y &&
              touchcoordinates.y>=90+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width)
            firstPage();
        }
        else if(pageNum==1){
            if(touchcoordinates.y <=50+ height+coordinates.y
              && touchcoordinates.y>= 50+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width){
            keyword="ac";    
            secondPage();       
            }
            else if(touchcoordinates.y <=90+height+coordinates.y
                   && touchcoordinates.y>=90+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width){
            keyword="pu";
            secondPage();
            }
            else if(touchcoordinates.y <= 130+height+coordinates.y
                   && touchcoordinates.y>= 130+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width){
            keyword="en";
            secondPage();
            }
        }
        else if(pageNum==2){
            if(touchcoordinates.y <=50+ height+coordinates.y
              && touchcoordinates.y>= 50+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width){          
            radius=1000;
            thirdPage(secondOptions(),0);       
            }
            else if(touchcoordinates.y <=90+height+coordinates.y
                   && touchcoordinates.y>=90+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width){
            radius=5000;
            thirdPage(secondOptions(),0);
            }
            else if(touchcoordinates.y <= 130+height+coordinates.y
                   && touchcoordinates.y>= 130+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width){
            radius=20000;
            thirdPage(secondOptions(),0);
            }
        }
        else if(pageNum==3){
            var i=parseInt(localStorage.getItem("result_index"));
            if(touchcoordinates.y < height+90+coordinates.y &&
              touchcoordinates.y>=90+coordinates.y
              && touchcoordinates.x> coordinates.x+40
              && touchcoordinates.x< coordinates.x+width)       
            forthPage(display,i);    
        }    
        else if(pageNum==4){
            create_map();
        }
        
    }

    /************************show menu*************************************/
    //The start page
    function StartPage(){
            pageNum=0;
            var coordinates = emulator.coordinatesofEmulator(); 
            var menu = {            
                x:coordinates.x,
                y:coordinates.y,
                width:emulator.width(),
                height:emulator.height(),             
                message: "Travel App",
                color: "black"            
            };       
            emulator.clearScreen();
            emulator.drawbackImage('travel.jpg');
            emulator.draw(menu.x + 40,menu.y+90, menu.width - 80, menu.height/6, menu.color); 
            writemessage(menu.x + 40,menu.y+110,menu.message,menu.width-80);   
            
        }
     //The first page
    function firstPage(){
        
            pageNum=1;

           var coordinates = emulator.coordinatesofEmulator(); 
        var menu = {
            x:coordinates.x,
            y:coordinates.y,
            width:emulator.width(),
            height:emulator.height(),            
            message1: "Accommodation",
            message2: "Entertainment & Fun",
            message3: "Restaurants & Bars",
            color: "black"
        };
        emulator.clearScreen();
        emulator.drawbackImage('travel.jpg');    
        emulator.draw(menu.x + 40,menu.y+50, menu.width - 80, menu.height/6, menu.color); 
        emulator.draw(menu.x + 40,menu.y+90,menu.width - 80, menu.height/6, menu.color); 
        emulator.draw(menu.x + 40,menu.y+130,menu.width - 80, menu.height/6, menu.color);  
        writemessage(menu.x + 40,menu.y+70,menu.message1,menu.width-80); 
        writemessage(menu.x + 40,menu.y+110,menu.message2,menu.width-80);
        writemessage(menu.x + 40,menu.y+150,menu.message3,menu.width-80);  
    }   
    //The second page shows the radius.
    function secondPage(){
        

        pageNum=2;
        var coordinates = emulator.coordinatesofEmulator(); 
        var menu = {            
            x:coordinates.x,
            y:coordinates.y,
            width:emulator.width(),
            height:emulator.height(),
            message1: "1km",
            message2: "5km",
            message3: "20km",
            color: "black"            
        };       
        emulator.clearScreen();
        emulator.drawbackImage('travel.jpg');
        emulator.draw(menu.x + 40,menu.y+50, menu.width - 80, menu.height/6, menu.color); 
        emulator.draw(menu.x + 40,menu.y+90,menu.width - 80, menu.height/6, menu.color); 
        emulator.draw(menu.x + 40,menu.y+130,menu.width - 80, menu.height/6, menu.color);  
        writemessage(menu.x + 40,menu.y+70,menu.message1,menu.width-80); 
        writemessage(menu.x + 40,menu.y+110,menu.message2,menu.width-80);
        writemessage(menu.x + 40,menu.y+150,menu.message3,menu.width-80);          
    }

    //the third page
    //in third page:there are a list of objects, but only one of them , with index i, is shown here
    // save the index of current objects in display
    //
    function thirdPage(data,i){
        
        pageNum=3;
        i=parseInt(i);
        var coordinates = emulator.coordinatesofEmulator(); 
        var menu = {            
            x:coordinates.x,
            y:coordinates.y,
            width:emulator.width(),
            height:emulator.height(),             
            message: data[i].name,
            color: "black"            
        };       
        emulator.clearScreen();
        emulator.drawbackImage('travel.jpg');

        emulator.draw(menu.x + 40,menu.y+90, menu.width - 80, menu.height/6, menu.color);
        writemessage(menu.x + 40,menu.y+110,menu.message,menu.width-80);
        localStorage.setItem("result_index",i);
    }

    // the third page
    // if some one swipe up or down, the data on third page should be updated
    // swipe up: show the previous item
    // swipe down:show the next item
    function update_thirdPage(Down,Up){
        var i=parseInt(localStorage.getItem("result_index"));
        if(pageNum==3){
            if(Up && i>0){
                thirdPage(display,i-1);
            }

            if(Down && i< display.length -1){
                thirdPage(display,i+1);
            }
        }
    }
    //fourthPage:
    //show the detail of a specific item
    // name and address
    //specify a limited length in case of the length of string exceed the length of txt box
    // the message format is still unsolved  
    function forthPage(data,i){
        pageNum=4;
        var coordinates = emulator.coordinatesofEmulator(); 
        var menu = {            
            x:coordinates.x,
            y:coordinates.y,
            width:emulator.width(),
            height:emulator.height(),
            message1: data[i].name,
            message2: data[i].address[0],
            message3:"",
            message4:data[i].description,
            message5:"-Google",
            color: "black"
        };
        emulator.clearScreen();
        emulator.drawbackImage(data[i].images);

        for(i=1;i<data[i].address.length;i++)
            menu.message3+=data[i].address[i];

        emulator.draw(menu.x + 20,menu.y+150, menu.width-30, menu.height/6.8, menu.color);
        writemessage(menu.x + 20,menu.y+150,menu.message1,menu.width-50);
        writemessage(menu.x + 20,menu.y+180,menu.message2,menu.width);
        writemessage(menu.x + 20,menu.y + 160, menu.message4,menu.width-10);
        writemessage(menu.x + 20,menu.y + 170, menu.message5,menu.width);

    }

    function writemessage(x,y,message,maxwidth){
        
        var len=emulator.measureTextlen(message);
        
        if(len.width<120){
            emulator.write(x+(maxwidth-len.width)/2,y,message,maxwidth);
        }
        else emulator.write(x,y,message,maxwidth);      
    }




    /********************database********************************/
    
    //Retrieve local storage data and use them to collect the relative information from
    //data base. and saved in display
    //
    function secondOptions() {
        var match = keyword;
         display = [];
        var count = 0;
        var dst;
        var src = new google.maps.LatLng(-45.866815599999995,170.5178656);
        var i;
        switch(match){
            case "ac" :
                for ( i = 0; i<ac.length; i+=1) {
                    dst = new google.maps.LatLng(parseFloat(ac[i].location.lat),parseFloat(ac[i].location.long));
                    if(parseFloat(emulator.calcDistance(src,dst)) <= parseFloat(radius/1000)){
                        display[count]= ac[i];
                        count +=1;
                    }

                }
                break;
            case "pu" :
                for ( i = 0; i<pu.length; i+=1) {

                    dst = new google.maps.LatLng(parseFloat(pu[i].location.lat),parseFloat(ac[i].location.long));
                    if(parseFloat(emulator.calcDistance(src,dst)) <= parseFloat(radius/1000)){

                        display[count]= pu[i];
                        count +=1;
                    }

                }
                break;
            case "en" :
                for ( i = 0; i<en.length; i+=1) {
                    dst = new google.maps.LatLng(parseFloat(en[i].location.lat),parseFloat(en[i].location.long));
                    if(parseFloat(emulator.calcDistance(src,dst)) <= parseFloat(radius/1000)){
                        display[count]= en[i];
                        count +=1;
                    }
                }
                break;
        }
        
        return display;
    }

    /****************google map api*******************/
    
    //create google map behind canvas
    //
    function create_map(){
        map=emulator.creatediv("map","googlemap");
        emulator.appendtobody(map);
        
        var name=emulator.getEid("googlemap");
      
        emulator.setelementZindex("googlemap",10);
        emulator.setelementleft("googlemap",emulator.lefttop().x);
        emulator.setelementtop("googlemap",emulator.lefttop().y);
        emulator.setelementposition("googlemap","absolute");
        emulator.setelementheight("googlemap",emulator.framesize().h);
        emulator.setelementwidth("googlemap",emulator.framesize().w);
        var i=parseInt(localStorage.getItem("result_index"));
        var mapProp = {
             center: new google.maps.LatLng(parseFloat(display[i].location.lat),parseFloat(display[i].location.long)),
              zoom: 16,
              zoomControl: true,
              overviewMapControl: true
        };
    
        var map_element=emulator.getEid("googlemap");
        google.maps.event.addDomListener(window, 'load', initialize(map_element,mapProp));
        
        
    }
    // initialize google map ,add a exit button
    function initialize(map_element, map_para ) {   
        map = new google.maps.Map(map_element, map_para);
        var marker = new google.maps.Marker({
            position: map_para.center,
            map: map,
            title: 'Here'
          });
        
     

        var quitmap = emulator.creatediv("","");
        
        CenterControl(quitmap, map);
        CenterControl.index=1;
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(quitmap);  
        
    }
    //unfinished, emulator and app separation
    function CenterControl(controlDiv, map) {
            var controlUI = emulator.creatediv("","");
            emulator.setbackcolor(controlUI,'white');
            emulator.setcursor(controlUI,'pointer');
            emulator.appendtoparent(controlDiv,controlUI);
            var controlText = emulator.create('div',"","exitbutton");
            emulator.setTxt(controlText,'black','14px',"quitMap");
            emulator.appendtoparent(controlUI,controlText);
            emulator.destroydivonClick(controlUI,app.removeMap);       
  }
    pub.removeMap=function(){
        emulator.removebodyobject("googlemap");
    };
    
    /**********initiate********************/
        // start the app with three main category selections.
    //layout1 : the first button on left top, the following in horizontal center
    // the emulator specifies the x and y position.

    // show the first screen 
    function start() {
        pageNum = 0;
        StartPage();      
        
      
    }
 
   pub.setup = function () { 
        emulator.mouseeventtrigger(app.mousecallback);       
        start();   
    };
    return pub;
}());

$(document).ready(app.setup);


