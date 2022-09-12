var drive_select= document.getElementById('drive_select');
var explore= document.getElementById('explore');
var package= document.getElementById('package');
var universal_array=[],universal_path='',file_path='',pathway='',rec=0,unique_num=0,audio_files=[],multiplay=[],img_count=0;
const { lookupService } = require('dns');
const { ipcRenderer } = require('electron');
var fs = require('fs');
const js = require('./jsmediatags');
var audio_player = new Audio();
var audio_source = document.createElement('source');
var title_icon= document.getElementsByClassName('fas');
var mime = require('./mime-types');

// closing event
title_icon[0].addEventListener('click',()=>{
     window.close();
})
// minimization with ipc
title_icon[3].addEventListener('click',()=>{
    ipcRenderer.send('minimize','1');
})
title_icon[1].addEventListener('click',()=>{
    ipcRenderer.send('maximize','1');
    title_icon[1].style.display='none';
        title_icon[2].style.display='inline';

})
title_icon[2].addEventListener('click',()=>{
    ipcRenderer.send('unmaximize','1');
        title_icon[2].style.display='none';
        title_icon[1].style.display='inline';

})

// CHECKING THE EXISTANCE OF FOLDER AND FILES
for(let i=0;i<26;i++){
    fs.exists(String.fromCharCode(i+65)+':\\',(e)=>{
        if(e == true)
        drive_select.innerHTML += '<option value="'+String.fromCharCode(i+65)+':\\">'+'DRIVE&nbsp;&nbsp;&nbsp;&nbsp;'+String.fromCharCode(i+65)+'</option>';
    });
}

// MAKING OF THE DIRECTORY INTERFACE
explore.onclick=()=>{
  unique_num=0;
    package.innerHTML='';
    pathway = '';
    file_path = '';
    universal_path = '';
  fs.readdir(drive_select.value.substr(0,1)+':\\',(err,data)=>{
      var pic_bucket = Array.from(data);
      universal_array = pic_bucket;
      for(let i=0;i<pic_bucket.length;i++){
          fs.stat(drive_select.value.substr(0,1)+':\\'+pic_bucket[i],(err,state)=>{
            if(err){
               console.log(err);
            }else
              if(state.isDirectory() == true){
                  var space = document.createElement('div');
                  var folder = document.createElement('i');
                  var legend = document.createElement('div');
                  legend.innerHTML=pic_bucket[i];
                  folder.className='fa fa-folder';
                  folder.style.margin='8%';
                  folder.style.textShadow='2px 2px 4px black';
                  folder.style.fontSize='60px';
                  space.style.width='16%';
                  space.style.display='inline-block';
                  space.style.height='180px';
                  space.style.overflow='hidden';
                  space.style.margin='4%';
                  space.style.textAlign='center';
                  legend.style.textAlign='center';
                  space.appendChild(folder);
                  space.appendChild(legend);
                  package.appendChild(space);
              }else if(mime.lookup(pic_bucket[i]).substr(0,5) == 'audio'){
                var legend = document.createElement('div');
                           legend.innerHTML=pic_bucket[i];
                 js.read(drive_select.value.substr(0,1) + ':/'+pic_bucket[i],{
                      onSuccess:function(tag){
                        var image = tag.tags.picture;
                        if(image){
                           var base64string='';
                           for(var i=0;i<image.data.length;i++){
                              base64string += String.fromCharCode(image.data[i]);
                           }
                           var base64 = 'data:' + image.format + ';base64,' + window.btoa(base64string);
                           var pic = new Image();
                           var space = document.createElement('div');
                           legend.style.textAlign='center';
                           space.style.width='16%';
                           space.style.display='inline-block';
                           space.style.height='180px';
                           space.style.overflow='hidden';
                           space.style.margin='4%';
                           space.style.textAlign='center';
                           pic.style.width='100px';
                           pic.style.boxShadow='2px 2px 4px black';
                           pic.style.margin='8%';
                           pic.style.height='100px';
                           pic.setAttribute('src',base64);
                           pic.className='fa music';
                           pic.id=unique_num;
                           unique_num++;
                           space.appendChild(pic);
                           space.appendChild(legend);
                           package.appendChild(space);
                        }
                      }
                    });
             }else if(mime.lookup(pic_bucket[i]).substr(0,5) == 'video'){
                js.read(drive_select.value.substr(0,1) + ':/'+pic_bucket[i],{
                    onSuccess:function(tag){
                         var source = document.createElement('source');
                         var video = document.createElement('video');
                         var space = document.createElement('div');
                         var leg = document.createElement('div');
                         var link = drive_select.value.substr(0,1) + ':\\' + pic_bucket[i];
                         source.src= link.replace(/#/g,'%23');
                         space.style.width='16%';
                         space.style.display='inline-block';
                         space.style.height='180px';
                         space.style.overflow='hidden';
                         space.style.margin='4%';
                         space.style.textAlign='center';
                         video.style.width='100px';
                         video.style.margin='8%';
                         video.style.height='100px';
                         leg.innerHTML=pic_bucket[i];
                         leg.style.textAlign='center';
                         video.className='video';
                         video.style.boxShadow='2px 2px 4px black';
                         video.appendChild(source);
                         space.appendChild(video);
                         space.appendChild(leg);
                         package.appendChild(space);
                        }});

             }
          })
        }
     })
}

// entering the sub folder
package.ondblclick=(e)=>{
  document.getElementsByClassName('fa-step-forward')[0].style.display='none';
  document.getElementsByClassName('fa-step-backward')[0].style.display='none';
  unique_num=0;
    if(e.target.className == 'fa fa-folder'){
      rec=0;
      multiplay=[];
      img_count=0;
      document.getElementById('multi_bucket2').style.width='0%';
      document.getElementById('multi_bucket').innerHTML='<tr style="border: solid;"><th>TITLE</th></tr>';
        package.style.width='100%';
        package.innerHTML='';
         pathway += '\\'+e.target.nextSibling.innerHTML;
         file_path +='/'+e.target.nextSibling.innerHTML;
         universal_path = pathway;
        fs.readdir(drive_select.value.substr(0,1)+':'+pathway,(err,data)=>{
            var sub_bucket = Array.from(data);
            universal_array = sub_bucket;
            for(let i=0;i<sub_bucket.length;i++){
                fs.stat(drive_select.value.substr(0,1)+':'+pathway+'\\'+sub_bucket[i],(err,state)=>{
                    if(err){console.log(err)}
                    else
                    if(state.isDirectory() == true){
                        var space = document.createElement('div');
                        var folder = document.createElement('i');
                        var legend = document.createElement('div');
                        legend.innerHTML=sub_bucket[i];
                        folder.className='fa fa-folder';
                        folder.style.margin='8%';
                        folder.style.textShadow='2px 2px 4px black';
                        folder.style.fontSize='60px';
                        space.style.width='16%';
                        space.style.display='inline-block';
                        space.style.height='180px';
                        space.style.overflow='hidden';
                        space.style.margin='4%';
                        space.style.textAlign='center';
                        legend.style.textAlign='center';
                        space.appendChild(folder);
                        space.appendChild(legend);
                        package.appendChild(space);
                    }else if(mime.lookup(sub_bucket[i]).substr(0,5) == 'audio'){
                        universal_array = sub_bucket;
                        var legend = document.createElement('div');
                                 legend.innerHTML=sub_bucket[i];
                       js.read(drive_select.value.substr(0,1) +':'+file_path+ '/'+sub_bucket[i],{
                            onSuccess:function(tag){
                              var image = tag.tags.picture;
                              if(image){
                                 var base64string='';
                                 for(var i=0;i<image.data.length;i++){
                                    base64string += String.fromCharCode(image.data[i]);
                                 }
                                 var base64 = 'data:' + image.format + ';base64,' + window.btoa(base64string);
                                 var pic = new Image();
                                 var space = document.createElement('div');
                                 legend.style.textAlign='center';
                                 space.style.width='16%';
                                 space.style.display='inline-block';
                                 space.style.height='180px';
                                 space.style.overflow='hidden';
                                 space.style.margin='4%';
                                 space.style.textAlign='center';
                                 pic.style.width='100px';
                                 pic.style.margin='8%';
                                 pic.style.boxShadow='2px 2px 4px black';
                                 pic.style.height='100px';
                                 pic.setAttribute('src',base64);
                                 pic.className='fa music';
                                 pic.id=unique_num;
                                 unique_num++;
                                 space.appendChild(pic);
                                 space.appendChild(legend);
                                 package.appendChild(space);
                              }else{
                                var pic = new Image();
                                var space = document.createElement('div');
                                legend.style.textAlign='center';
                                space.style.width='16%';
                                space.style.display='inline-block';
                                space.style.height='180px';
                                space.style.overflow='hidden';
                                space.style.margin='4%';
                                space.style.textAlign='center';
                                pic.style.width='100px';
                                pic.style.margin='8%';
                                pic.style.boxShadow='2px 2px 4px black';
                                pic.style.height='100px';
                                pic.setAttribute('src','fizz_default.png');
                                pic.className='fa music';
                                pic.id=unique_num;
                                unique_num++;
                                space.appendChild(pic);
                                space.appendChild(legend);
                                package.appendChild(space);
                              }
                            }
                          });
                   }else if(mime.lookup(sub_bucket[i]).substr(0,5) == 'video'){
                    universal_array = sub_bucket;
                             var source = document.createElement('source');
                             var video = document.createElement('video');
                             var space = document.createElement('div');
                             var leg = document.createElement('div');
                             var link = drive_select.value.substr(0,1) +':'+file_path+ '/'+sub_bucket[i];
                             source.src= link.replace(/#/g,'%23');
                             space.style.width='16%';
                             space.style.display='inline-block';
                             space.style.height='180px';
                             space.style.overflow='hidden';
                             space.style.margin='4%';
                             space.style.textAlign='center';
                             video.style.width='100px';
                             video.style.margin='8%';
                             video.style.boxShadow='2px 2px 4px black';
                             video.style.height='100px';
                             leg.innerHTML=sub_bucket[i];
                             leg.style.textAlign='center';
                             video.className='video';
                             video.appendChild(source);
                             space.appendChild(video);
                             space.appendChild(leg);
                             package.appendChild(space);

                 }
                })
              }
        })


    }else
    if(e.target.className == 'fa music'){
      rec=0;
      audio_player.pause();
      audio_player.currentTime = 0;
      document.getElementById('video_player').pause();
      document.getElementById('video_player').currentTime = '0';
      document.getElementById('duration').value = '0';
      document.getElementsByClassName('fa-play')[0].style.display='inline';
      document.getElementsByClassName('fa-pause')[0].style.display='none';
      if(e.ctrlKey !== true){
        multiplay=[];
        sessionStorage.clear();
        img_count=0;
        document.getElementById('multi_bucket2').style.width='0%';
        document.getElementById('multi_bucket').innerHTML='<tr style="border: solid;"><th>TITLE</th></tr>';
        package.style.width='100%';
        audio_files = [];
        audio_source.removeAttribute('src');
        for(let i=0;i<universal_array.length;i++){
         if(universal_array[i].substr(universal_array[i].length-3,3) == 'mp3'){
         audio_files.push(universal_array[i]);
          }
        }
        document.getElementById('concentric_pic').src = e.target.src;
        document.getElementById('mini_pic').src = e.target.src;
        document.getElementById('play_art').style.backgroundImage = 'url('+e.target.src+')';
        if(height_adder !== 0)
        document.getElementById('concentric').style.display='block';
        document.getElementById('play_art').style.filter='blur(8px)';
        document.getElementById('play_art').style.backgroundSize='100% 100%';
        audio_player.style.display = 'none';
        if(universal_path == ''){
          let link= drive_select.value.substr(0,1)+':\\'+ e.target.nextSibling.innerHTML;
          audio_source.src = link.replace(/#/g,'%23');
        }else{
          link = drive_select.value.substr(0,1)+':'+universal_path+'\\'+ e.target.nextSibling.innerHTML;
          audio_source.src = link.replace(/#/g,'%23');
        }
        audio_source.type = 'audio/mp3';
        audio_player.appendChild(audio_source);
        document.getElementById('play_art').appendChild(audio_player);
        document.getElementById('video_player').style.display='none';
        audio_player.load();
        }

    if(e.ctrlKey == true){
      document.getElementsByClassName('fa-step-forward')[0].style.display='inline';
      document.getElementsByClassName('fa-step-backward')[0].style.display='inline';
      if(height_adder !== 0)
      document.getElementById('concentric').style.display='block';
      document.getElementById('play_art').style.filter='blur(8px)';
      document.getElementById('play_art').style.backgroundSize='100% 100%';

      let row_once=0;
      for(let i=0;i<multiplay.length;i++){
      if(multiplay[i] == e.target.nextSibling.innerHTML){
        row_once++;
      }
      }
      if(row_once == 0 && multiplay.length !== 0){
        multiplay.push(e.target.nextSibling.innerHTML);
        sessionStorage.setItem(++img_count,e.target.src);
        document.getElementById('concentric_pic').src = sessionStorage.getItem('1');
        document.getElementById('mini_pic').src = sessionStorage.getItem('1');
        document.getElementById('play_art').style.backgroundImage = 'url('+sessionStorage.getItem('1')+')';
        audio_player.style.display = 'none';
        if(universal_path == ''){
          audio_source.src = (drive_select.value.substr(0,1)+':\\'+ multiplay[0]).replace(/#/g,'%23');
          }else{
            audio_source.src = (drive_select.value.substr(0,1)+':'+universal_path+'\\'+ multiplay[0]).replace(/#/g,'%23');
          }
          audio_source.type = 'audio/mp3';
          audio_player.appendChild(audio_source);
          document.getElementById('play_art').appendChild(audio_player);
          document.getElementById('video_player').style.display='none';
        document.getElementById('duration').value = '0';
        package.style.width='100%';
        document.getElementById('multi_bucket2').style.width='40%';
        var tr = document.createElement('tr');
        tr.style.border='1px solid black';
        tr.style.height='5vh';
        tr.innerHTML='<td style="text_align:center;width:100%;border-top:1px solid #ddd;" class="row">'+e.target.nextSibling.innerHTML+'</td>';
        document.getElementById('multi_bucket').appendChild(tr);
      }
      if(multiplay.length == 0){
        multiplay.push(e.target.nextSibling.innerHTML);
        sessionStorage.setItem(++img_count,e.target.src);
        document.getElementById('concentric_pic').src = sessionStorage.getItem('1');
        document.getElementById('mini_pic').src = sessionStorage.getItem('1');
        document.getElementById('play_art').style.backgroundImage = 'url('+sessionStorage.getItem('1')+')';
        audio_player.style.display = 'none';
        if(universal_path == ''){
          audio_source.src = (drive_select.value.substr(0,1)+':\\'+ multiplay[0]).replace(/#/g,'%23');
        }else{
            audio_source.src = (drive_select.value.substr(0,1)+':'+universal_path+'\\'+ multiplay[0]).replace(/#/g,'%23');
        }
        audio_source.type = 'audio/mp3';
        audio_player.appendChild(audio_source);
        document.getElementById('play_art').appendChild(audio_player);
        document.getElementById('video_player').style.display='none';
        document.getElementById('duration').value = '0';
        package.style.width='100%';
        document.getElementById('multi_bucket2').style.width='40%';
        var tr = document.createElement('tr');
        tr.style.border='solid';
        tr.style.height='5vh';
        tr.innerHTML='<td style="text_align:center;width:100%;border-top:1px solid #ddd;" class="row">'+e.target.nextSibling.innerHTML+'</td>';
        document.getElementById('multi_bucket').appendChild(tr);
      }
      audio_player.load();
    }
 }else if(e.target.className == 'video'){
    document.getElementById('mini_pic').src='fizz_default.png';
    rec=0;
    multiplay=[];
    sessionStorage.clear();
    img_count=0;
    document.getElementById('multi_bucket2').style.width='0%';
    document.getElementById('multi_bucket').innerHTML='<tr style="border: solid;"><th>TITLE</th></tr>';
    package.style.width='100%';
    audio_player.pause();
    document.getElementById('video_player').pause();
    audio_player.currentTime = 0;
    document.getElementById('video_player').currentTime = '0';
    document.getElementById('duration').value = '0';
    document.getElementsByClassName('fa-play')[0].style.display='inline';
    document.getElementsByClassName('fa-pause')[0].style.display='none';
    document.getElementById('video_player').style.display='inline';
    document.getElementById('play_art').style.backgroundImage='';
    document.getElementsByClassName('fa-play')[0].style.display='inline';
    document.getElementsByClassName('fa-pause')[0].style.display='none';
    document.getElementById('concentric').style.display='none';
    document.getElementById('play_art').style.filter='blur(0px)';
    document.getElementById('play_art').style.backgroundSize='contain';
    document.getElementById('play_art').style.backgroundColor='';
    if(universal_path == ''){
      let link = drive_select.value.substr(0,1)+':\\'+ e.target.nextSibling.innerHTML;
      document.getElementById('video_source').src = link.replace(/#/g,'%23');
    }else{
      link = drive_select.value.substr(0,1)+':'+universal_path+'\\'+ e.target.nextSibling.innerHTML;
      document.getElementById('video_source').src = link.replace(/#/g,'%23');
    }
    document.getElementById('video_player').style.display='inline';
    document.getElementsByClassName('fa-expand')[0].click();
    document.getElementsByClassName('fa-arrows-alt')[0].style.opacity='1.0';
    document.getElementById('video_player').load();
 }
}

// END OF ONE FROM MULTIPLE AUDIO SET
audio_player.onended=()=>{
  if(multiplay.length>0){
    rec++;
    if(rec == multiplay.length){
      rec=0;
      document.getElementsByClassName('row')[multiplay.length-1].style.backgroundColor='white';
    }
    if(rec >0)
    document.getElementsByClassName('row')[rec-1].style.backgroundColor='white';
    document.getElementsByClassName('row')[rec].style.backgroundColor='#00fffc';
    audio_player.load();
    audio_player.play();
    audio_source.src = (drive_select.value.substr(0,1)+':'+universal_path+'\\'+ multiplay[rec]).replace(/#/g,'%23');
    document.getElementById('concentric_pic').src = sessionStorage.getItem(rec+1);
    document.getElementById('mini_pic').src = sessionStorage.getItem(rec+1);
    document.getElementById('play_art').style.backgroundImage = 'url('+sessionStorage.getItem(rec+1)+')';
    document.getElementById('duration').max=audio_player.duration;    
  }else{
    document.getElementsByClassName('fa-play')[0].style.display='inline';
    document.getElementsByClassName('fa-pause')[0].style.display='none';
  }
}

document.getElementById('video_player').onended=()=>{
  document.getElementsByClassName('fa-play')[0].style.display='inline';
  document.getElementsByClassName('fa-pause')[0].style.display='none';
};

// ON CURRENT TIME UPDATE
var date=new Date();
audio_player.ontimeupdate=()=>{
  document.getElementById('duration').value = audio_player.currentTime;
  document.getElementById('current_time').innerHTML= sToTime(audio_player.currentTime);
  function sToTime(t) {
    return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
           padZero(parseInt((t / (60)) % 60)) + ":" +
           padZero(parseInt((t) % 60));
  }
  function padZero(v) {
    return (v < 10) ? "0" + v : v;
  }
}

document.getElementById('video_player').ontimeupdate=()=>{
  document.getElementById('duration').value = document.getElementById('video_player').currentTime;
  document.getElementById('current_time').innerHTML= sToTime(document.getElementById('video_player').currentTime);
  function sToTime(t) {
    return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
           padZero(parseInt((t / (60)) % 60)) + ":" +
           padZero(parseInt((t) % 60));
  }
  function padZero(v) {
    return (v < 10) ? "0" + v : v;
  }
}

document.getElementById('video_player').ondurationchange=()=>{
  document.getElementById('duration').max = document.getElementById('video_player').duration;
  document.getElementById('period').innerHTML= sToTime(document.getElementById('video_player').duration);
  function sToTime(t) {
    return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
           padZero(parseInt((t / (60)) % 60)) + ":" +
           padZero(parseInt((t) % 60));
  }
  function padZero(v) {
    return (v < 10) ? "0" + v : v;
  }
}
audio_player.ondurationchange=()=>{
  document.getElementById('duration').max = audio_player.duration;
  document.getElementById('period').innerHTML= sToTime(audio_player.duration);
  function sToTime(t) {
    return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
           padZero(parseInt((t / (60)) % 60)) + ":" +
           padZero(parseInt((t) % 60));
  }
  function padZero(v) {
    return (v < 10) ? "0" + v : v;
  }
}

//on manual change of current play
document.getElementById('duration').oninput=()=>{
  if(document.getElementById('video_player').style.display == 'none'){
  audio_player.currentTime=document.getElementById('duration').value;
  }else{
  document.getElementById('video_player').currentTime=document.getElementById('duration').value;
  }
}
//volume customization
document.getElementById('volume').oninput=()=>{
  audio_player.volume = parseFloat(document.getElementById('volume').value/100);
  document.getElementById('video_player').volume = parseFloat(document.getElementById('volume').value/100) ;
}

// max and min
var height_adder = 50,height_subtract = 50;
document.getElementsByClassName('fa-expand')[0].onclick=()=>{
  document.getElementById('video_player').style.position ='absolute';
  document.getElementById('video_player').style.top ='50%';
  document.getElementById('video_player').style.left ='50%';
  document.getElementById('video_player').style.transform ='translate(-50%,-50%)';

  if(height_adder !== 100){
  height_adder = height_adder + 50;
  height_subtract = height_subtract - 50;
  document.getElementsByClassName('fa-compress')[0].style.opacity='1.0';
  document.getElementsByClassName('fa-expand')[0].style.opacity='1.0';
  document.getElementById('play_art').style.backgroundSize='100% 100%';
  if(height_adder == 100){
    document.getElementsByClassName('fa-compress')[0].style.opacity='1.0';
    document.getElementsByClassName('fa-expand')[0].style.opacity='0.3';
    document.getElementById('play_art').style.backgroundSize='cover';
  }
  }
  if(height_adder < 101){
  document.getElementById('play_art').style.height=height_adder +'vh';
  document.getElementById('package11').style.height=height_subtract + 'vh';
  document.getElementById('multi_bucket2').style.height=height_subtract + 'vh';

  }
  if(height_adder == 100){
    document.getElementById('concentric').style.display='none';
    document.getElementById('play_art').style.filter='blur(0px)';
    document.getElementById('play_art').style.backgroundSize='contain';
  }else{
    document.getElementById('concentric').style.display='block';
    document.getElementById('play_art').style.filter='blur(8px)';
    document.getElementById('play_art').style.backgroundSize='100% 100%';
  }
  if(document.getElementById('play_art').style.height == '50vh' && document.getElementById('video_player').style.display =='inline'){
    document.getElementById('video_player').style.width ='30%';
    document.getElementById('video_player').style.height ='40vh';
    document.getElementById('concentric').style.display='none';
    document.getElementById('play_art').style.filter='blur(0px)';
    document.getElementById('play_art').style.backgroundSize='contain';
  }else{
    document.getElementById('video_player').style.width ='100%';
    document.getElementById('video_player').style.height ='86vh';
  }
}

document.getElementsByClassName('fa-compress')[0].onclick=()=>{
  document.getElementById('video_player').style.position ='absolute';
  document.getElementById('video_player').style.top ='50%';
  document.getElementById('video_player').style.left ='50%';
  document.getElementById('video_player').style.transform ='translate(-50%,-50%)';
  if(document.getElementById('play_art').style.height == '50vh'){
    document.getElementById('video_player').style.width =='50%';
  }else{
    document.getElementById('video_player').style.width =='100%';
  }
  if(height_subtract !== 100){
  height_adder = height_adder - 50;
  height_subtract = height_subtract + 50;
  document.getElementsByClassName('fa-compress')[0].style.opacity='1.0';
  document.getElementsByClassName('fa-expand')[0].style.opacity='1.0';
  document.getElementById('play_art').style.backgroundSize='100% 100%';
  if(height_subtract == 100){
    document.getElementsByClassName('fa-compress')[0].style.opacity='0.3';
    document.getElementsByClassName('fa-expand')[0].style.opacity='1.0';
    document.getElementById('play_art').style.backgroundSize='cover';
  }
  }
  if(height_adder > -1){
  document.getElementById('play_art').style.height=height_adder +'vh';
  document.getElementById('package11').style.height=height_subtract + 'vh';
  document.getElementById('multi_bucket2').style.height=height_subtract + 'vh';

  }
  if(height_subtract == 100){
    document.getElementById('concentric').style.display='none';
    document.getElementById('play_art').style.filter='blur(0px)';
    document.getElementById('play_art').style.backgroundSize='contain';
  }else{
    document.getElementById('concentric').style.display='block';
    document.getElementById('play_art').style.filter='blur(8px)';
    document.getElementById('play_art').style.backgroundSize='100% 100%';

  }

  if(document.getElementById('play_art').style.height == '50vh' && document.getElementById('video_player').style.display =='inline'){
    document.getElementById('video_player').style.width ='30%';
    document.getElementById('video_player').style.height ='40vh';
    document.getElementById('concentric').style.display='none';
    document.getElementById('play_art').style.filter='blur(0px)';
    document.getElementById('play_art').style.backgroundSize='contain';
  }else{
    document.getElementById('video_player').style.width ='100%';
    document.getElementById('video_player').style.height ='86vh';
  }

}

// audio and video
document.getElementsByClassName('fa-play')[0].onclick=()=>{
  document.getElementById('volume').value = parseFloat(audio_player.volume*100);
  document.getElementById('volume').value = parseFloat(document.getElementById('video_player').volume*100);
  if(document.getElementById('video_player').style.display =='inline'){
    document.getElementById('video_player').play();
    if(document.getElementById('video_player').paused == true){
      alert('THE TITLE OF THE FILE IS ANONYMOUS . PLEASE,TRY TO CHANGE IT AND REBOOT THE APP AGAIN...');
    }
  }else{
    document.getElementById('duration').value = audio_player.currentTime;
    document.getElementById('duration').max = audio_player.duration;
    if(audio_source.src == ''){
      alert('THE REQUISITE FILE IS MISSING IN THE REQUIRED SECTOR.........PLEASE SELECT THE RELEVENT FILE TO START THE TRACK...');
    }
    audio_player.play();
    if(document.getElementById('video_player').style.display == 'none' && audio_player.paused == true){
      alert('THE TITLE OF THE FILE IS ANONYMOUS . PLEASE,TRY TO CHANGE IT AND REBOOT THE APP AGAIN...');
    }
  }
  document.getElementsByClassName('fa-play')[0].style.display='none';
  document.getElementsByClassName('fa-pause')[0].style.display='inline';
  if(multiplay.length>0)
  document.getElementsByClassName('row')[rec].style.backgroundColor='#00fffc';
}

document.getElementsByClassName('fa-pause')[0].onclick=()=>{
  audio_player.pause();
  document.getElementById('video_player').pause();
  document.getElementsByClassName('fa-play')[0].style.display='inline';
  document.getElementsByClassName('fa-pause')[0].style.display='none';

  for(let i=0;i<multiplay.length;i++){
    document.getElementsByClassName('row')[rec].style.backgroundColor='white';
  }
}
document.getElementsByClassName('fa-stop')[0].onclick=()=>{
  audio_player.pause();
  document.getElementById('video_player').pause();
  audio_player.currentTime = 0;
  document.getElementById('video_player').currentTime = 0;
  document.getElementById('duration').value = '0';
  rec=0;
  multiplay=[];
  sessionStorage.clear();
  img_count=0;
  document.getElementById('multi_bucket2').style.width='0%';
  document.getElementById('multi_bucket').innerHTML='<tr style="border: solid;"><th>TITLE</th></tr>';
  package.style.width='100%';
  document.getElementsByClassName('fa-play')[0].style.display='inline';
  document.getElementsByClassName('fa-pause')[0].style.display='none';
  audio_player.load();
}

// fullscreen configuration
document.getElementsByClassName('fa-arrows-alt')[0].onclick=()=>{
  document.getElementById('video_player').style.position ='absolute';
  document.getElementById('video_player').style.top ='50%';
  document.getElementById('video_player').style.left ='50%';
  document.getElementById('video_player').style.transform ='translate(-50%,-50%)';
  document.getElementById('video_player').style.marginTop ='3vh';

  if(  document.getElementById('video_player').style.display == 'inline' ){
  document.getElementsByClassName('fa-arrow-left')[0].style.display='none'
  document.getElementsByClassName('fa-play')[0].style.display='none';
  document.getElementById('explore').style.display='none';
  document.getElementById('drive_select').style.display='none';
  document.getElementsByClassName('fa-arrows-alt')[0].style.display='none';
  document.getElementsByClassName('fa-window-restore')[0].style.display='inline';
  document.getElementsByClassName('title')[0].style.display='none';
  document.getElementById('play_art').style.position='absolute';
  document.getElementById('play_art').style.top='0px';
  document.getElementById('play_art').style.left='0px';

  document.getElementById('play_art').style.width='100%';
  document.getElementById('play_art').style.height='100vh';
  document.getElementById('video_player').style.minWidth='100%';
  document.getElementById('video_player').style.minHeight='100vh';
  document.getElementById('video_player').style.position='absolute';
  document.getElementById('video_player').style.top='47%';
  document.getElementById('video_player').style.left='50%';
  document.getElementById('video_player').style.transform='translate(-50%,-50%)';
  document.getElementById('video_player').style.height='auto';

  document.getElementById('play_bar').style.display = 'none';
  document.getElementsByTagName('video')[0].style.marginTop='0px';

  ipcRenderer.send('fullscreen');
  document.getElementsByClassName('title_bar')[0].style.width='50px';
  document.getElementsByClassName('title_bar')[0].style.height='30px';
  document.getElementsByClassName('title_bar')[0].style.borderRadius='50px';
  document.getElementById('video_player').play();

  }else{
    document.getElementsByClassName('fa-arrows-alt')[0].style.opacity='0.4';

  }

}

document.getElementsByClassName('fa-window-restore')[0].onclick=()=>{
  document.getElementById('video_player').style.marginTop ='';

  document.getElementsByClassName('fa-arrow-left')[0].style.display='inline'
  document.getElementsByClassName('fa-play')[0].style.display='none';
  document.getElementsByClassName('fa-pause')[0].style.display='inline';

  document.getElementById('explore').style.display='inline';
  document.getElementById('drive_select').style.display='inline';
  document.getElementsByClassName('fa-arrows-alt')[0].style.display='inline';
  document.getElementsByClassName('fa-window-restore')[0].style.display='none';
  document.getElementsByClassName('title')[0].style.display='block';
  document.getElementById('play_bar').style.display = 'flex';

  document.getElementById('play_art').style.position='';
  document.getElementById('play_art').style.top='';
  document.getElementById('play_art').style.left='';
  document.getElementById('play_art').style.width='100%';
  document.getElementById('video_player').style.minWidth='';
  document.getElementById('video_player').style.minHeight='';
  document.getElementById('video_player').style.position ='absolute';
  document.getElementById('video_player').style.top ='50%';
  document.getElementById('video_player').style.left ='50%';
  document.getElementById('video_player').style.transform ='translate(-50%,-50%)';
  document.getElementById('play_art').style.height=height_adder +'vh';
  document.getElementById('package11').style.height=height_subtract + 'vh';
  document.getElementById('multi_bucket2').style.height=height_subtract + 'vh';


  if(document.getElementById('play_art').style.height == '50vh' && document.getElementById('video_player').style.display =='inline'){
    document.getElementById('video_player').style.width ='30%';
    document.getElementById('video_player').style.height ='40vh';
    document.getElementById('concentric').style.display='none';
    document.getElementById('play_art').style.filter='blur(0px)';
    document.getElementById('play_art').style.backgroundSize='contain';
  }else{
    document.getElementById('video_player').style.width ='100%';
    document.getElementById('video_player').style.height ='86vh';
  }
  if(height_adder !== 100){
    height_adder = height_adder + 50;
    height_subtract = height_subtract - 50;
    document.getElementsByClassName('fa-compress')[0].style.opacity='1.0';
    document.getElementsByClassName('fa-expand')[0].style.opacity='1.0';
    document.getElementById('play_art').style.backgroundSize='100% 100%';
    }else{
      document.getElementsByClassName('fa-compress')[0].style.opacity='1.0';
      document.getElementsByClassName('fa-expand')[0].style.opacity='0.3';
      document.getElementById('play_art').style.backgroundSize='cover';
    }
    if(height_adder < 101){
    document.getElementById('play_art').style.height=height_adder +'vh';
    document.getElementById('package11').style.height=height_subtract + 'vh';
    document.getElementById('multi_bucket2').style.height=height_subtract + 'vh';

    }
    if(height_adder == 100){
      document.getElementById('concentric').style.display='none';
      document.getElementById('play_art').style.filter='blur(0px)';
      document.getElementById('play_art').style.backgroundSize='contain';
    }else{
      document.getElementById('concentric').style.display='block';
      document.getElementById('play_art').style.filter='blur(8px)';
      document.getElementById('play_art').style.backgroundSize='100% 100%';
    }
    ipcRenderer.send('restore');
    document.getElementsByClassName('title_bar')[0].style.width='100%';
  document.getElementsByClassName('title_bar')[0].style.height='6vh';
  document.getElementsByClassName('title_bar')[0].style.borderRadius='0px';
}

// to and fro movement of store
document.getElementsByClassName('fa-arrow-left')[0].onclick=()=>{
  var path_array=pathway.split(''),counter=path_array.length-1,length=path_array.length;
  var file_array=file_path.split(''),counter2=file_array.length-1,length2=file_array.length;
  if(pathway !== '' && file_path !== ''){
  for(let i=path_array.length-1;path_array[i] !== '\\' ; i--){
     counter--;
  }
  for(let i=counter;i<length ; i++){
    path_array.pop();
  }
  for(let i=file_array.length-1;file_array[i] !== '/' ; i--){
    counter2--;
  }
  for(let i=counter2;i<length2 ; i++){
    file_array.pop();
  }

pathway = path_array.join('');
file_path = file_array.join('');
if(pathway !== '\\' && file_path !== '/'){
unique_num=0;
  multiplay=[];
  img_count=0;
  document.getElementById('multi_bucket2').style.width='0%';
  document.getElementById('multi_bucket').innerHTML='<tr style="border: solid;"><th>TITLE</th></tr>';
    package.style.width='100%';
    package.innerHTML='';
    universal_path = pathway;
    fs.readdir(drive_select.value.substr(0,1)+':\\'+pathway,(err,data)=>{
       var sub_bucket = Array.from(data);
        universal_array = sub_bucket;
        for(let i=0;i<sub_bucket.length;i++){
            fs.stat(drive_select.value.substr(0,1)+':'+pathway+'\\'+sub_bucket[i],(err,state)=>{
               if(!err)
                if(state.isDirectory() == true){
                    var space = document.createElement('div');
                    var folder = document.createElement('i');
                    var legend = document.createElement('div');
                    legend.innerHTML=sub_bucket[i];
                    folder.className='fa fa-folder';
                    folder.style.margin='8%';
                    folder.style.textShadow='2px 2px 4px black';
                    folder.style.fontSize='60px';
                    space.style.width='16%';
                    space.style.display='inline-block';
                    space.style.height='180px';
                    space.style.overflow='hidden';
                    space.style.margin='4%';
                    space.style.textAlign='center';
                    legend.style.textAlign='center';
                    space.appendChild(folder);
                    space.appendChild(legend);
                    package.appendChild(space);
                }else if(mime.lookup(sub_bucket[i]).substr(0,5) == 'audio'){
                    universal_array = sub_bucket;
                    var legend = document.createElement('div');
                             legend.innerHTML=sub_bucket[i];
                   js.read(drive_select.value.substr(0,1) +':'+file_path+ '/'+sub_bucket[i],{
                        onSuccess:function(tag){
                          var image = tag.tags.picture;
                          if(image){
                             var base64string='';
                             for(var i=0;i<image.data.length;i++){
                                base64string += String.fromCharCode(image.data[i]);
                             }
                             var base64 = 'data:' + image.format + ';base64,' + window.btoa(base64string);
                             var pic = new Image();
                             var space = document.createElement('div');
                             legend.style.textAlign='center';
                             space.style.width='16%';
                             space.style.display='inline-block';
                             space.style.height='180px';
                             space.style.overflow='hidden';
                             space.style.margin='4%';
                             space.style.textAlign='center';
                             pic.style.width='60px';
                             pic.style.margin='8%';
                             pic.style.boxShadow='2px 2px 4px black';
                             pic.style.height='60px';
                             pic.setAttribute('src',base64);
                             pic.className='fa music';
                             pic.id=unique_num;
                             unique_num++;
                             space.appendChild(pic);
                             space.appendChild(legend);
                             package.appendChild(space);
                          }else{
                            var pic = new Image();
                            var space = document.createElement('div');
                            legend.style.textAlign='center';
                            space.style.width='16%';
                            space.style.display='inline-block';
                            space.style.height='180px';
                            space.style.overflow='hidden';
                            space.style.margin='4%';
                            space.style.textAlign='center';
                            pic.style.width='60px';
                            pic.style.margin='8%';
                            pic.style.boxShadow='2px 2px 4px black';
                            pic.style.height='60px';
                            pic.setAttribute('src','fizz_default.png');
                            pic.className='fa music';
                            pic.id=unique_num;
                            unique_num++;
                            space.appendChild(pic);
                            space.appendChild(legend);
                            package.appendChild(space);
                          }
                        }
                      });
               }else if(mime.lookup(sub_bucket[i]).substr(0,5) == 'video'){
                universal_array = sub_bucket;
                         var source = document.createElement('source');
                         var video = document.createElement('video');
                         var space = document.createElement('div');
                         var leg = document.createElement('div');
                         var link = drive_select.value.substr(0,1)+':'+universal_path+'\\'+ sub_bucket[i];
                         source.src= link;
                         space.style.width='16%';
                         space.style.display='inline-block';
                         space.style.height='180px';
                         space.style.overflow='hidden';
                         space.style.margin='4%';
                         space.style.textAlign='center';
                         video.style.width='100px';
                         video.style.margin='8%';
                         video.style.boxShadow='2px 2px 4px black';
                         video.style.height='70px';
                         leg.innerHTML=sub_bucket[i];
                         leg.style.textAlign='center';
                         video.className='video';
                         video.appendChild(source);
                         space.appendChild(video);
                         space.appendChild(leg);
                         package.appendChild(space);

             }
            })
          }
    });
  }else{
    explore.click();
  }
 }
}

//instant visual button response
document.getElementsByClassName('mouse')[0].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[0].style.color='#b3b3b3';
});
document.getElementsByClassName('mouse')[0].onmouseup=()=>{
  document.getElementsByClassName('mouse')[0].style.color='#00fffc';
}
document.getElementsByClassName('mouse')[1].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[1].style.backgroundColor='#b3b3b3';

});
document.getElementsByClassName('mouse')[1].onmouseup=()=>{
  document.getElementsByClassName('mouse')[1].style.backgroundColor='#00fffc';

}
document.getElementsByClassName('mouse')[2].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[2].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[2].onmouseup=()=>{
  document.getElementsByClassName('mouse')[2].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[3].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[3].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[3].onmouseup=()=>{
  document.getElementsByClassName('mouse')[3].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[4].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[4].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[4].onmouseup=()=>{
  document.getElementsByClassName('mouse')[4].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[5].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[5].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[5].onmouseup=()=>{
  document.getElementsByClassName('mouse')[5].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[6].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[6].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[6].onmouseup=()=>{
  document.getElementsByClassName('mouse')[6].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[7].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[7].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[7].onmouseup=()=>{
  document.getElementsByClassName('mouse')[7].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[8].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[8].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[8].onmouseup=()=>{
  document.getElementsByClassName('mouse')[8].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[9].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[9].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[9].onmouseup=()=>{
  document.getElementsByClassName('mouse')[9].style.color='#00fffc';

}
document.getElementsByClassName('mouse')[10].addEventListener('mousedown',()=>{
  document.getElementsByClassName('mouse')[10].style.color='#b3b3b3';

});
document.getElementsByClassName('mouse')[10].onmouseup=()=>{
  document.getElementsByClassName('mouse')[10].style.color='#00fffc';

}

//Representing pointer on the screen
package.onmousemove=(e)=>{
   if(e.target.className == 'fa fa-folder' || e.target.className == 'fa music' || e.target.className == 'video'){
     package.style.cursor='pointer';
   }else{
     package.style.cursor='default';
   }
}

document.getElementsByClassName('fa-step-backward')[0].onclick=()=>{
  if(rec>0){
    rec--;
    if(rec == multiplay.length){
      rec=0;
      document.getElementsByClassName('row')[multiplay.length-1].style.backgroundColor='white';
    }
    if(rec <multiplay.length)
    document.getElementsByClassName('row')[rec+1].style.backgroundColor='white';
    document.getElementsByClassName('row')[rec].style.backgroundColor='#00fffc';
    audio_source.src = drive_select.value.substr(0,1)+':'+universal_path+'\\'+ multiplay[rec];
    audio_player.load();
    document.getElementsByClassName('fa-play')[0].click();
    document.getElementById('concentric_pic').src = sessionStorage.getItem(rec+1);
    document.getElementById('mini_pic').src = sessionStorage.getItem(rec+1);
    document.getElementById('play_art').style.backgroundImage = 'url('+sessionStorage.getItem(rec+1)+')';
    document.getElementById('duration').max=audio_player.duration;
  }
}

document.getElementsByClassName('fa-step-forward')[0].onclick=()=>{
  if(rec<multiplay.length-1){
    rec++;
    if(rec == multiplay.length){
      rec=0;
      document.getElementsByClassName('row')[multiplay.length-1].style.backgroundColor='white';
    }
    if(rec > 0)
    document.getElementsByClassName('row')[rec-1].style.backgroundColor='white';
    document.getElementsByClassName('row')[rec].style.backgroundColor='#00fffc';
    audio_source.src = drive_select.value.substr(0,1)+':'+universal_path+'\\'+ multiplay[rec];
    audio_player.load();
    document.getElementsByClassName('fa-play')[0].click();
    document.getElementById('concentric_pic').src = sessionStorage.getItem(rec+1);
    document.getElementById('mini_pic').src = sessionStorage.getItem(rec+1);
    document.getElementById('play_art').style.backgroundImage = 'url('+sessionStorage.getItem(rec+1)+')';
    document.getElementById('duration').max=audio_player.duration;
  }
}

document.getElementsByClassName('fa-volume-up')[0].onclick=()=>{
  document.getElementsByClassName('fa-volume-off')[0].style.display='inline';
  document.getElementsByClassName('fa-volume-up')[0].style.display='none';
  if(document.getElementById('video_player').style.display == 'inline'){
    document.getElementById('video_player').volume='0';
  }else{
    audio_player.volume='0';
  }
}

document.getElementsByClassName('fa-volume-off')[0].onclick=()=>{
  document.getElementsByClassName('fa-volume-off')[0].style.display='none';
  document.getElementsByClassName('fa-volume-up')[0].style.display='inline';
  if(document.getElementById('video_player').style.display == 'inline'){
    document.getElementById('video_player').volume=parseFloat(document.getElementById('volume').value/100);
  }else{
    audio_player.volume=parseFloat(document.getElementById('volume').value/100);
  }
}

ipcRenderer.send('init');
ipcRenderer.once('file_to_exec',(eve,arg)=>{
  audio_source.src = arg[2];
  audio_player.appendChild(audio_source);
  audio_player.play();
})
