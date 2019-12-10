import React, { useState,useEffect } from "react";
import "./App.css";
import * as id3 from 'id3js';
function App() {
 
const [ playList , setPlayList ] = useState([]);
const [ songPlay, setSongPlay ] = useState();
const [songNow, setSongNow] = useState('');




  const downLoadPlayList = (e) =>{
     
    const listsongs = [...e.currentTarget.files]
    listsongs.map((el)=>{
        let newObj = el
        console.log(el)
     id3.fromFile(el).then((tags) => {
          

       if(tags){
     newObj.artist = tags.artist? tags.artist: null
     newObj.album = tags.album? tags.album: null
     newObj.title = tags.title? tags.title: null
     newObj.year = tags.year? tags.year: null
     newObj.images = tags.images? imageConvector(tags.images[0].data): null

     setPlayList([...listsongs])
       }
     else{
      setPlayList([...listsongs])
     }
  }); 
  }) 
  }

  function imageConvector(img){
    let TYPED_ARRAY = new Uint8Array(img)
    
    const STRING_CHAR = TYPED_ARRAY.reduce(( data , byte ) => { 
      return data + String.fromCharCode(byte); 
      }, '');
    let base64String = btoa(STRING_CHAR);
    return `data:image/jpg;base64, ${base64String}`
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
    <div className='player__active'>
      <img src={songNow.images} alt=''/>
     <span>{songNow.title} {songNow.album} {songNow.year}</span></div>
   <audio  src={songPlay} autoPlay controls className='player__controls' onEnded={newTrack}/>
  
    <ul className='player__list'>
    {playList.map((song, i)=>{
      
      return (
        <li onClick={()=>playSong(song)} className='player__list-item player__list-item--active'> 
        <span className='player__list-index'>{i+1}.</span><img src={song.images} alt='' className='player__list-img' /> 
        {song.artist}  {song.title?song.title:song.name}  {song.album} {song.year}</li>  
      )
    })}
    </ul>
    </div>
    </div>
    </>
  );
}

export default App;
