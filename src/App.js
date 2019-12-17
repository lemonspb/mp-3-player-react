import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from 'react-dropzone'
import "./App.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import demoSong from './sound/04. One.mp3'
import * as musicMetadata from 'music-metadata-browser';

function App() {


  const [playList, setPlayList] = useState([]);
  const [songPlay, setSongPlay] = useState();
  const [loopOneTrack, setLoopOneTrack] = useState(false);
  const [currentValue, setCurrentValue] = useState(0)
  const [stopPlayingSong, setStopPlayingSong] = useState(true)
  const [songIndex, setSongIndex] = useState('');
  const [songObj, setSongObj] = useState('');
  const [isOpenList, setIsOpenList] = useState(true);
  const [isDemoSongPlay, setIsDemoSongPlay] = useState(false)
  const audioRef = useRef()
  const imageRef = useRef()
  const listItemRef = useRef()


  const playDemoSong = () => {
    setIsDemoSongPlay(true)
    setSongPlay(demoSong)
    let newObj = {}
    musicMetadata.fetchFromUrl(demoSong).then(tags => {
      newObj.artist = tags.common.artist
      newObj.album = tags.common.album
      newObj.title = tags.common.title
      newObj.year = tags.common.year
      newObj.images = tags.common.picture[0] ? imageСonverter(tags.common.picture[0].data) : null
      setSongObj(newObj)
      setPlayList([newObj])
      setSongIndex(0)

    });
  }

  const  downLoadPlayList =  (e)  => {
    setIsDemoSongPlay(false)
    let listsongs = [...e]
    
    listsongs.forEach((el) => {
      console.log(el)
          musicMetadata.parseBlob(el).then( tags => {
        if (tags) {
          el.artist = tags.common.artist
          el.album = tags.common.album
          el.title = tags.common.title
          el.year = tags.common.year
          el.images = tags.common.picture[0] ? imageСonverter(tags.common.picture[0].data) : null
               playList.push(el)
            setPlayList([...playList])

        }
        else {
          setPlayList([...playList])
        }
        
      })
     
    })
   
  }

  const onDrop = useCallback(acceptedFiles => {
    downLoadPlayList(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  function imageСonverter(img) {
    let TYPED_ARRAY = new Uint8Array(img)

    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);
    return `data:image/jpg;base64, ${base64String}`
  }
  const timeСonverter = (sec) => {
    const seconds = Math.floor(sec % 60) <= 9 ? '0' + Math.floor(sec % 60) : Math.floor(sec % 60)
    return `${Math.floor(sec / 60) || '00'}:${seconds || '00'}`
  }

  const playSong = (index) => {
    setStopPlayingSong(true)
    if (isDemoSongPlay) {
      setSongPlay(demoSong)

    } else {
      setSongIndex(index)
      setSongObj(playList[index])
      setSongPlay(URL.createObjectURL(playList[index]))
    }

  }

  const playNextTrack = () => {

    setStopPlayingSong(true)
    if (isDemoSongPlay) {
      setSongPlay(demoSong)
      setSongIndex(0)
      audioRef.current.play()

    } else {
      const next = songIndex + 1 < playList.length ? songIndex + 1 : 0
      setSongIndex(next)
      setSongObj(playList[next])
      setSongPlay(URL.createObjectURL(playList[next]))
    }


  }
  const playPrevTrack = () => {
    const prev = songIndex - 1 >= 0 ? songIndex - 1 : playList.length - 1;
    setSongIndex(prev)
    setStopPlayingSong(true)
    if (isDemoSongPlay) {
      audioRef.current.play()
      setSongPlay(demoSong)

    } else {
      setSongObj(playList[prev])
      setSongPlay(URL.createObjectURL(playList[prev]))
    }

  }

  const playTrack = () => {
    setStopPlayingSong(audioRef.current.paused)
    audioRef.current.play()
  }

  const pauseTrack = () => {
    setStopPlayingSong(audioRef.current.paused)
    audioRef.current.pause()
  }



  const onChangeValue = (event) => {
    audioRef.current.currentTime = event
  }

  const onOpenList = () => {
    setIsOpenList(!isOpenList)
  }
  

  const randomPlayList = () => {
    setPlayList(playList.sort(() => Math.random() - 0.5));

  }
  // const reversePlayList = () => {
    
  // }

  const loopSong = () => {
    setLoopOneTrack(!loopOneTrack)
  }

  useEffect(() => {
    audioRef.current.ontimeupdate = () => {
      setCurrentValue(audioRef.current.currentTime)
    }

  }, [audioRef]);



  useEffect(() => {
   console.log(playList)
  },[]);


  return (
    <>

      <div className="player">
        <div className='player__input-wrap player__input-wrap--desctop' {...getRootProps()}>
          <input type='file' onChange={downLoadPlayList} id='input-files' multiple className='player__download' accept='audio/*' {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p> Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
        <div className='player__input-wrap player__input-wrap--mobile'>
          <label htmlFor='input-files'>
            <p> click to select files</p>

          </label>
          <input type='file' onChange={downLoadPlayList} id='input-files' multiple className='player__download' accept='audio/*'  />

        </div>
        <div className='player__container'>
          <div className='player__active'>

            <img src={songObj.images} alt='' className={`player__image ${stopPlayingSong ? 'player__image--active' : ''}`} ref={imageRef} />
            <div className='player-active-details'>
              <div className='player-active-details__item'><span className='player-active-details__title'>{songObj.title}</span><span className='player-active-details__subtitle' >{songObj.artist}</span></div>
            </div>
          </div>
          <Slider
            min={0}
            max={audioRef.current ? audioRef.current.duration : 0}
            step={0.1}
            onChange={onChangeValue}
            value={Number(currentValue)}
            railStyle={{ background: "rgb(193, 193, 193)", height: "4px" }}
            trackStyle={{ height: "4px", background: "tomato" }}
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
            {stopPlayingSong ? <div onClick={pauseTrack} className='iconfont icon-stop'></div> : <div onClick={playTrack} className='iconfont icon-play'></div>}
            <div onClick={playNextTrack} className='iconfont icon-next'></div>

          </div>

          <audio src={songPlay} autoPlay controls className='player__controls' onEnded={loopOneTrack ? playTrack : playNextTrack} ref={audioRef} />
          <div className='player__btn-block player__btn-block--sub'>
            <div onClick={randomPlayList} className='iconfont icon-random'></div>
            <div onClick={()=>setPlayList(playList.reverse())} className='iconfont icon-arrow-down'></div>
            <div onClick={loopSong} className={`iconfont icon-loop-single  ${loopOneTrack ? 'icon-loop-single--active' : ''}`}></div>
            <div onClick={playDemoSong} className={`iconfont icon-listen ${isDemoSongPlay ? `icon-listen--active` : ''}`}></div>
            <div onClick={onOpenList} className='iconfont icon-list'></div>
          </div>


          {isOpenList ? <ul className='player__list' id="style-3">
            {playList.map((song, i) => {

              return (

                <li onClick={() => playSong(i)} className={`player__list-item ${i === songIndex ? 'player__list-item--active' : ''}`} ref={listItemRef} key={i}>
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
