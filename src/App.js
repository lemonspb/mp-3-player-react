import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import * as id3 from 'id3js';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";


function App() {

  const [playList, setPlayList] = useState([]);
  const [songPlay, setSongPlay] = useState();
  const [currentValue, setCurrentValue] = useState(0)
  const [stop, setStop] = useState(true)
  const [songNow, setSongNow] = useState('');
  const [isOpenList, setIsOpenList] = useState(true);
  const audioRef = useRef()
  const imageRef = useRef()
  const listItemRef = useRef()
  const downLoadPlayList = (e) => {

    const listsongs = [...e.currentTarget.files]
    listsongs.map((el) => {
      let newObj = el
      id3.fromFile(el).then((tags) => {
        newObj.active = ''
        
        if (tags) {
          newObj.artist = tags.artist ? tags.artist : null
          newObj.album = tags.album ? tags.album : null
          newObj.title = tags.title ? tags.title : null
          newObj.year = tags.year ? tags.year : null
          newObj.images = tags.images ? imageСonverter(tags.images[0].data) : null

          setPlayList([...listsongs])
        }
        else {
          setPlayList([...listsongs])
        }
      });
    })
  }

  function imageСonverter(img) {
    let TYPED_ARRAY = new Uint8Array(img)

    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);
    return `data:image/jpg;base64, ${base64String}`
  }

  const playSong = (objsong) => {
    setSongNow(objsong)
    setStop(true)
    imageRef.current.classList.add('player__image--active')
    setSongPlay(URL.createObjectURL(objsong))
  }

  const playNextTrack = () => {
    playList.filter((_, i, arr) => {
      if (arr[arr.length - 1].name === songNow.name) {
        setSongNow(arr[0])
        setSongPlay(URL.createObjectURL(arr[0]))
        setStop(true)
        imageRef.current.classList.add('player__image--active')
      }
      else if (arr[i].name === songNow.name) {
        setStop(true)
        setSongNow(arr[++i])
        setSongPlay(URL.createObjectURL(arr[i]))
        imageRef.current.classList.add('player__image--active')
      }
    })
  }
  const playPrevTrack = () => {
    playList.filter((_, i, arr) => {
      if (arr[0].name === songNow.name) {
        setSongNow(arr[arr.length - 1])
        setSongPlay(URL.createObjectURL(arr[arr.length - 1]))
        setStop(true)
        imageRef.current.classList.add('player__image--active')
      }
      else if (arr[i].name === songNow.name) {
        imageRef.current.classList.add('player__image--active')
        setStop(true)
        setSongNow(arr[--i])
        setSongPlay(URL.createObjectURL(arr[i]))

      }
    })
  }

  const playTrack = () => {
  
    setStop(audioRef.current.paused)
    imageRef.current.classList.add('player__image--active')
    audioRef.current.play()
  }
  const pauseTrack = () => {
    setStop(audioRef.current.paused)
    imageRef.current.classList.remove('player__image--active')
    audioRef.current.pause()
  }

  const timeСonverter = (sec) => {
    const seconds = Math.floor(sec % 60) <= 9 ? '0' + Math.floor(sec % 60) : Math.floor(sec % 60)
    return `${Math.floor(sec / 60)}:${seconds}`
  }

  const onChangeValue = (e) => {
    console.log(e)
    audioRef.current.currentTime = e
  }

  const onOpenList = () => {
    setIsOpenList(!isOpenList)
  }

  const randomPlayList = () => {
    setPlayList(playList.sort(()=>Math.random() - 0.5));
   
  }
  const reversePlayList= ()=>{
    setPlayList(playList.reverse())
  }
  useEffect(() => {
    audioRef.current.ontimeupdate = () => {

      setCurrentValue(audioRef.current.currentTime / audioRef.current.duration * 100)
    }
  }, [audioRef]);





  return (
    <>

      <div className="player">
        <label htmlFor='input-files'>select audio files</label>
        <input type='file' onChange={downLoadPlayList} id='input-files' multiple className='player__download' webkitdirectory />
        <div className='player__container'>
          <div className='player__active'>

            <img src={songNow.images} alt='' className='player__image player__image--active' ref={imageRef} />
            <div className='player-active-details'>
              <div className='player-active-details__item'><span className='player-active-details__title'>{songNow.title}</span><span className='player-active-details__subtitle' >{songNow.artist}</span></div>
            </div>
          </div>
          <Slider
            min={0}
            max={100}
            step={0.1}
            onChange={onChangeValue}
            value={Number(currentValue)}
            railStyle={{ background: "rgb(193, 193, 193)", height: "4px" }}
            trackStyle={{ height: "4px", background: "red" }}
            handleStyle={{
              width: "15px",
              height: "15px",
              border: "red",
              background: 'rgb(193, 193, 193)',
              marginTop: "-5px"
            }}

          />
          <div className='player__time'>
            <span>{audioRef.current ? timeСonverter(audioRef.current.currentTime) : ''}</span>
            <span>{audioRef.current ? timeСonverter(audioRef.current.duration) : ''}</span>

          </div>

          <div className='player__btn-block'>
           
            <div onClick={playPrevTrack} className='iconfont icon-prev'></div>
            {stop ? <div onClick={pauseTrack} className='iconfont icon-stop'></div> : <div onClick={playTrack} className='iconfont icon-play'></div>}
            <div onClick={playNextTrack} className='iconfont icon-next'></div>

          </div>

          <audio src={songPlay} autoPlay controls className='player__controls' onEnded={playNextTrack} ref={audioRef} />
          <div className='player__btn-block player__btn-block--sub'>
          <div onClick={randomPlayList} className='iconfont icon-random'></div>
          <div onClick={reversePlayList} className='iconfont icon-arrow-down'></div>

          <div onClick={onOpenList} className='iconfont icon-list'></div>
         
          </div>
          {isOpenList ? <ul className='player__list'>
            {playList.map((song, i) => {

              return (
                <li onClick={() => playSong(song)} className={`player__list-item  ${song.active}`} ref={listItemRef}>
                  <span className='player__list-index'>{i + 1}</span><img src={song.images} alt='' className='player__list-img' />
                  <div className='player__list-details'><span className='player__list-song'>{song.title ? song.title : song.name}</span><span className='player__list-artist'>{song.artist}</span></div>    </li>
              )
            })}
          </ul> : null}

        </div>
      </div>
    </>
  );
}

export default App;
