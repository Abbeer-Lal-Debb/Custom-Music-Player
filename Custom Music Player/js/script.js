// Let's select all Required Tags or Elements
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    mainAudio = wrapper.querySelector("#main-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
    loadMusic(musicIndex);   //Calling load music function once window loaded
    playingSong();
});

// Load Music Function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    musicIndex++; //increment of musicIndex by 1
    //if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//prev music function
function prevMusic() {
    musicIndex--; //decrement of musicIndex by 1
    //if musicIndex is less than 1 then musicIndex will be the array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isPauseMusic is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingSong();
});

//next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

//prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting currentTime of song
    const duration = e.target.duration; //getting total duration  of playing song 
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuartion = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        if (totalSec < 10) { //if sec is less than 10 then add '0' before it
            totalSec = `0${totalSec}`;
        }
        musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { //if sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
    playMusic(); //calling playMusic function
    playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {

    // First we get the innerText of the icon then we will change accordingly 
    let getText = repeatBtn.innerText; //Getting Inner Text of icon

    // Let's do different changes on different icon click using icon 
    switch (getText) {
        case "repeat": // If this icon is repeat, then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": // If icon is repeat_one, then change it to Shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle": // If icon is Shuffle, then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", () => {
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do further accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch (getText) {
        // If this icon is repeat, then simply we will call the nextMusic function so the next song will play
        case "repeat":
            nextMusic(); //calling nextMusic function
            break;

        // If icon is repeat_one, then we will change the current playing song current time to '0' so song will play from beginning
        case "repeat_one":
            mainAudio.currentTime = 0; //setting audio current time to 0
            loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
            playMusic(); //calling playMusic function
            break;

        // If icon is Shuffle, then change it to repeat    
        case "shuffle":
            //genereting random index/numb with max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
            musicIndex = randIndex; //passing randomIndex to musicIndex
            loadMusic(musicIndex);  //Calling Load Music Function
            playMusic();  //Calling play Music Function
            playingSong();
            break;
    }
});

//show music list onclick of music icon
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});


const ulTag = wrapper.querySelector("ul");
// create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) { //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        };

        liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duration of song

        //adding t-duration attribute with total duration value
        liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//play particular song from the list onclick of li tag
function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            //  Getting the audio duration value and pass to .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //Passing t-duration value to audio duration innerText
        }

        //If there is an li tag in which li-index is equal to musicIndex
        //then music is playing now 
        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        // Adding OnClick attribute in all li tags
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

//particular li clicked function
function clicked(element) {
    //Getting Li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}