import React, { useState,useRef,useEffect } from "react";
import "./App.css";
import * as id3 from 'id3js';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";


function App() {
 
const [ playList , setPlayList ] = useState([]);
const [ songPlay, setSongPlay ] = useState();
const [currentValue, setCurrentValue] = useState(0)
const [stop, setStop] = useState(false)
const [songNow, setSongNow] = useState('');
const audioRef = useRef()


  const downLoadPlayList = (e) =>{
     
    const listsongs = [...e.currentTarget.files]
    listsongs.map((el)=>{
        let newObj = el
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
      if(arr[arr.length - 1].name  === songNow.name ){
        setSongNow(arr[0]) 
        setSongPlay(URL.createObjectURL(arr[0])) 

      }
      else if(arr[i].name === songNow.name){
       
          setSongNow(arr[++i])
          setSongPlay(URL.createObjectURL(arr[i])) 
       
        }  
      })
  }
  const playNextTrack = () =>{
    playList.filter((_ ,i,arr)=>{
      if(arr[arr.length - 1].name  === songNow.name ){
        setSongNow(arr[0]) 
        setSongPlay(URL.createObjectURL(arr[0])) 

      }
      else if(arr[i].name === songNow.name){
       
          setSongNow(arr[++i])
          setSongPlay(URL.createObjectURL(arr[i])) 
       
        }  
      })
  }
  const playPrevTrack = () =>{
    playList.filter((_ ,i,arr)=>{
      if(arr[0].name  === songNow.name ){
        setSongNow(arr[arr.length - 1]) 
        setSongPlay(URL.createObjectURL(arr[arr.length - 1])) 

      }
      else if(arr[i].name === songNow.name){
       
          setSongNow(arr[--i])
          setSongPlay(URL.createObjectURL(arr[i])) 
       
        }  
      })
  }

  const playTrack = () =>{
    setStop(false)
    audioRef.current.play()
  }
  const pauseTrack = () =>{
    setStop(true)
    audioRef.current.pause()
  }

  const timeConvector = (sec) =>{
    const seconds = Math.floor(sec % 60)<=9? '0' + Math.floor(sec % 60):Math.floor(sec % 60)
   return `${Math.floor(sec / 60)}:${seconds }`
  }

  useEffect(() => {
    audioRef.current.ontimeupdate = ()=>{
     
      setCurrentValue(audioRef.current.currentTime/audioRef.current.duration * 100)
    }
  }, [audioRef]);



 


  return (
      <>

    <div className="player">
    <label htmlFor='input-files'>select audio files</label>
    <input type='file' onChange={downLoadPlayList} id='input-files' multiple className='player__download'/> 
    <div className='player__container'>
    <div className='player__active'>
      <img src={songNow.images} alt=''/>
      <span>Song:{songNow.title}  Artist {songNow.artist} Album:{songNow.album} Year:{songNow.year}</span></div>
          <Slider
          min={0}
          max={100}
          step={1}
          value={Number(currentValue)}
          railStyle={{ background: "rgb(193, 193, 193)", height: "4px" }}
          trackStyle={{ height: "4px", background: "red" }}
          handleStyle={{
            width: "15px",
            height: "15px",
            border: "red",
            background:'rgb(193, 193, 193)',
            marginTop: "-5px"
          }}
          
        />
        <div className='player__time'>
                  <span>{audioRef.current? timeConvector(audioRef.current.currentTime): ''}</span>
        <span>{audioRef.current? timeConvector(audioRef.current.duration): ''}</span>

        </div>
     
     <div className='player__btn-block'>
     <div onClick={playPrevTrack} className='iconfont icon-prev'></div>
       {!stop?<div onClick={pauseTrack} className='iconfont icon-stop'></div>:<div onClick={playTrack} className='iconfont icon-play'></div>  }
       <div onClick={playNextTrack} className='iconfont icon-next'></div>
     
     </div>
 
   <audio  src={songPlay} autoPlay controls className='player__controls' onEnded={newTrack}  ref={audioRef}/>
  
    <ul className='player__list'>
    {playList.map((song, i)=>{
      
      return (
        <li onClick={()=>playSong(song)} className='player__list-item '> 
        <span className='player__list-index'>{i+1}.</span><img src={song.images} alt='' className='player__list-img' /> 
        {song.artist}  {song.title?song.title:song.name}  </li>  
      )
    })}
    </ul>
    </div>
    </div>
    </>
  );
}

export default App;
