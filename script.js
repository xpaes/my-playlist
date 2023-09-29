const songName = document.getElementById("song-name");
const song = document.getElementById("audio");
const bandName = document.getElementById("band-name");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressBox = document.getElementById("progress-box");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const likeButton = document.getElementById("like");

const slimeYouOut = {
    songName : "Slime You Out",
    artist : "Drake feat. SZA",
    file: "slime_you_out",
    liked: false,
};

const cominOutStrong = {
    songName : "Comin Out Strong",
    artist : "Future feat. The Weeknd",
    file: "future",
    liked: false,
};
let isPlaying = false;
let isShuffle = false;
let repeatOn = false;
let likeOn = false;
const playlist = JSON.parse(localStorage.getItem("playlist")) ?? [slimeYouOut, cominOutStrong];
let sortedPlaylist = [...playlist];
let index = 0;

function playSong(){
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }    
    else {
        playSong();
    }
}

function likeButtonRender(){
    if (sortedPlaylist[index].liked === true){
        likeButton.querySelector(".bi").classList.remove("bi-heart");
        likeButton.querySelector(".bi").classList.add("bi-heart-fill");
        likeButton.classList.add("button-like");
    }
    else {
        likeButton.querySelector(".bi").classList.add("bi-heart");
        likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
        likeButton.classList.remove("button-like");
    }
}

function onSong(){
    cover.src = `images/${sortedPlaylist[index].file}.webp`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    onSong();
    playSong();
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else {
        index += 1;
    }
    onSong();
    playSong();
}

function upProgress(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressBox.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()* size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleButtonClicked() {
    if(isShuffle === false){
        isShuffle = true;
        sortedPlaylist = [...playlist];
        shuffleButton.classList.remove("button-active");
    }
    else {
        isShuffle = false;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add("button-active");
    }
}

function repeatButtonClicked() {
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add("button-active");
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove("button-active");
    }
}

function likeButtonClicked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }
    else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem("playlist", JSON.stringify(playlist));
}

function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

onSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", upProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressBox.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);