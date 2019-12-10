import React, { useState,useEffect } from "react";
import "./App.css";
import * as id3 from 'id3js';
function App() {
 
const [ playList , setPlayList ] = useState([]);
const [ songPlay, setSongPlay ] = useState();
const [songNow, setSongNow] = useState('');
const [imageSong, setImageSong] = useState();
// const findImage = (arr) =>{
//   arr.find((el)=>{
//     if(el.name.includes('jpg')){
//       return setImageSong(URL.createObjectURL(el))
//     }
//   })
  
// }



  const downLoadPlayList = (e) =>{
     
    const listsongs = [...e.currentTarget.files]
    console.log(listsongs)
    listsongs.map((el)=>{
        let newObj = el
     id3.fromFile(el).then((tags) => {
       console.log(tags)
       if(tags){
     newObj.artist = tags.artist? tags.artist: null
     newObj.album = tags.album? tags.album: null
     newObj.year = tags.year? tags.year: null
     newObj.images = tags.images? tags.images: null

     setPlayList([...listsongs])
       }
     else{
       return null
     }
  });
  
  })
  
    
  
  }
  const playSong = (objsong)=>{
    setSongNow(objsong)
    setSongPlay(URL.createObjectURL(objsong))
  }

  const newTrack = () =>{
    playList.filter((_ ,i,arr)=>{
    if(arr[i].name === songNow.name){
      setSongNow(arr[++i])
      setSongPlay(URL.createObjectURL(arr[i])) 
    }  
    })
  }



  return (
      <>

    <div className="player">
    <input type='file' onChange={downLoadPlayList} multiple className='player__download' /> 
    <div className='player__container'>
   <audio  src={songPlay} autoPlay controls className='player__controls' onEnded={newTrack}/>
   <div className='player__active'>
     <span>{songNow.name}</span></div>
    <ul className='player__list'>
    {playList.map((song)=>{
      return (
        <li onClick={()=>playSong(song)} className='player__list-item player__list-item--active'>{song.artist} - {song.name}  {song.album} {song.year}</li>  
      )
    })}
    </ul>
    </div>
    </div>
    {/* <div class='player1'>
    <img src='data:image/jpeg;base64,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'/>
    <div class='info'>
      <div class='name'>All of me</div>
      <div class='singer'>John Legend</div>
    </div>
    <div class='btns'>
      <div class="iconfont play-pause icon-play"></div>
      <div class="iconfont next icon-next"></div>
    </div>
    <div class='progress'>

    </div>
  </div> */}
    </>
  );
}

export default App;
