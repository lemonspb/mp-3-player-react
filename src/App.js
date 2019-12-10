import React, { useState,useRef,useEffect } from "react";
import "./App.css";
import * as id3 from 'id3js';
function App() {
 
const [ playList , setPlayList ] = useState([]);
const [ songPlay, setSongPlay ] = useState();
const [stop, setStop] = useState(false)
const [songNow, setSongNow] = useState('');
const audioRef = useRef()
const progressRef = useRef()


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

  useEffect(() => {
    audioRef.current.ontimeupdate = ()=>{
      progressRef.current.style.width = audioRef.current.currentTime/audioRef.current.duration * 100 + '%'
    }
  


  }, [audioRef]);

  const playTrack = () =>{
    setStop(false)
    audioRef.current.play()
  }
  const pauseTrack = () =>{
    setStop(true)
    audioRef.current.pause()
  }


  return (
      <>

    <div className="player">
    <label htmlFor='input-files'>select audio files</label>
    <input type='file' onChange={downLoadPlayList} id='input-files' multiple className='player__download'/> 
    <div className='player__container'>
    <div className='player__active'>
      <img src={songNow.images} alt=''/>
      <div className='progress' ref={progressRef}></div>
     <span>{songNow.title} {songNow.album} {songNow.year}</span></div>
     <div className='player__btn-block'>
       {!stop?<div onClick={pauseTrack} className='iconfont icon-stop'></div>:<div onClick={playTrack} className='iconfont icon-play'></div>  }
     
     
     </div>
 
   <audio  src={songPlay} autoPlay controls className='player__controls' onEnded={newTrack}  ref={audioRef}/>
  
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
