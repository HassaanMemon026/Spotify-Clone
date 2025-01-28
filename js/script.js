let currentSong = new Audio();
let songs;
let currenFolder;
let currentFolderName;
let mainFolder = "mp3/";
let index;

let previous = document.querySelector("#previous");
let play = document.querySelector("#play");
let next = document.querySelector("#next")
async function getFolder(folder) {
    let a = await fetch(`./${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cardContainer")
    let as = div.getElementsByTagName("a")
    Array.from(as).forEach(async (e) => {
        if (e.href.includes("mp3/") && e.href.endsWith("/")) {
            let folder = e.innerText.slice(0, -1)
            let a = await fetch(`./mp3/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}">
                        <div class="play">
                            <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/mp3/${folder}/background.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    });
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSong(folder) {
    currenFolder = folder;
    let a = await fetch(`./${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs

}

async function getSongName(folder) {
    currenFolder = folder;
    let a = await fetch(`./${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    let rSongs = [];
    let Nsongs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            Nsongs.push(element.innerHTML.slice(0, -3));
        }
    }

    return Nsongs

}

function playSong(element, rPlay) {
    currentSong.src = element;
    currentSong.play();
    index = songs.indexOf(currentSong.src);
    play.src = "/img/pause.svg";
    rPlay.src = "/img/pause.svg";
    rPlay.classList.add("invert")
    rPlay.classList.add("liburaryPlay")
    document.querySelector(".playbarInfo").innerHTML = decodeURI(element).split("mp3/")[1].split("/")[1].slice(0, -3);
    // document.querySelector(".playbarInfo").innerHTML = decodeURI(element).split("/").pop().replace(".mp3", "");
    document.querySelector(".playbarTime").innerHTML = "00:00 / 00:00";
}
async function playFirstSong(element, pause = false) {
    currentSong.src = element;
    if (!pause) {
        currentSong.play()
        play.src = "/img/pause.svg";

    }
    // document.querySelector(".playbarInfo").innerHTML = element.split("mp3/")[1].replaceAll("%20", " ").slice(0, -3);
    document.querySelector(".playbarInfo").innerHTML = decodeURI(element).split("mp3/")[1].split("/")[1].slice(0, -3);

    currentSong.addEventListener("loadedmetadata", () => {

        let duration = currentSong.duration;
        document.querySelector(".playbarTime").innerHTML = `00:00 / ${secondsToMinutesSeconds(duration)}`;
        
    });
}

// Previous song function 
function previousSong(e) {

    // may be in future want to add split "/" method
    index = songs.indexOf(currentSong.src);

    if ((index - 1) >= 0) {
        let lis = Array.from(document.querySelectorAll(".songList li"));
        let liIndex = lis.indexOf(document.querySelector(".songList li.active"));
        playSong(songs[index - 1], document.querySelector(".active .playnow img"));
        // set img invert and active class to old li
        lis[liIndex].classList.remove("active");
        lis[liIndex].querySelector(".playnow img").src = "img/play round.svg";
        lis[liIndex].querySelector(".playnow img").classList.toggle("invert");
        // set img invert and active class to new li
        lis[liIndex - 1].classList.add("active");
        lis[liIndex - 1].querySelector(".playnow img").src = "img/pause.svg";
        lis[liIndex - 1].querySelector(".playnow img").classList.toggle("invert");

    } else {
        console.log("Start of playlist reached.");
    }
}

// Next song function
function nextSong(e) {

    // may be in future want to add split "/" method
    index = songs.indexOf(currentSong.src);

    if ((index + 1) < songs.length) {
        let lis = Array.from(document.querySelectorAll(".songList li"))
        let liIndex = lis.indexOf(document.querySelector(".songList li.active"));
        playSong(songs[index + 1], document.querySelector(".active .playnow img"));
        // set img invert and active class to old li
        lis[liIndex].classList.remove("active");
        lis[liIndex].querySelector(".playnow img").src = "img/play round.svg"
        lis[liIndex].querySelector(".playnow img").classList.toggle("invert")
        // set img invert and active class to new li
        lis[liIndex + 1].classList.add("active");
        lis[liIndex + 1].querySelector(".playnow img").src = "img/pause.svg"
        lis[liIndex + 1].querySelector(".playnow img").classList.toggle("invert")
    } else {
        console.log("End of playlist reached.");
    }

}


async function main() {
    //add function to select disable to All img
    function disable() {
        document.getElementById("red").disabled = true;
    }
    //get albums 
    getFolder(`mp3`)


    songs = await getSong(`mp3/Common Naats`)
    console.log(songs);
    let songsName = await getSongName(`mp3/Common Naats`)
    console.log(songsName);
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    //Show all songs in the play list
    for (const song of songsName) {
        songUl.innerHTML = songUl.innerHTML + `<li class="liburaryLis"> 
        <img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div class="">${song.replaceAll("%20", " ")}</div>
                                <div class=""><i>Hassaan Raza Qadri</i></div>
                                </div>
                            <div class="playnow">
                            <span>Play Now</span>
                            <img class="roundPlay" src="img/play round.svg" alt="play">
                            </div>
                            </li>`
    }

    playFirstSong(songs[0], true)
    document.querySelectorAll(".songList li")[0].classList.add("active")

    //add an event listener to card
    Array.from(document.querySelectorAll(".card")).forEach((e) => {
        e.addEventListener("click", async (element) => {
            if (currentSong) {
                play.src = "img/play.svg";
                document.querySelector(".seekbar .circle").style.left = "0%"
            }
            let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
            songUl.innerHTML = "";
            let folder = element.currentTarget.dataset.folder;
            currenFolder = `./${mainFolder}${folder}`;
            songs = await getSong(currenFolder.replaceAll(" ", "%20"));
            songsName = await getSongName(currenFolder.replaceAll(" ", "%20"));
            //Show all songs in the play list
            for (const song of songsName) {
                songUl.innerHTML = songUl.innerHTML + `<li class="liburaryLis"> 
        <img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div class="">${song.replaceAll("%20", " ")}</div>
                                <div class=""><i>Hassaan Raza Qadri</i></div>
                                </div>
                            <div class="playnow">
                            <span>Play Now</span>
                            <img class="roundPlay" src="img/play round.svg" alt="play">
                            </div>
                            </li>`

            }
            playFirstSong(songs[0], true)
            index = songs.indexOf(currentSong.src);
            document.querySelector(".songList").getElementsByTagName("li")[0].classList.add("active");
            document.querySelector(".hamburger").click()
        })
    })

    //Add event listener to all songs li
    document.querySelector(".songList").addEventListener("click", (event) => {
        const clickedElement = event.target.closest("li");
        if (!clickedElement) return;

        Array.from(document.querySelectorAll(".songList li")).forEach((item) => {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            }
        })
        Array.from(document.querySelectorAll(".songList li .playnow img")).forEach((item) => {
            if (item.classList.contains("invert", "liburaryPlay")) {
                item.classList.remove("active", "liburaryPlay", "invert");
                item.src = "img/play round.svg";
            }
        })

        clickedElement.classList.add("active")

        playSong(currenFolder + "/" + encodeURI(clickedElement.querySelector(".info").firstElementChild.innerHTML) + "mp3", clickedElement.querySelector(".roundPlay"))
        index = songs.indexOf(currentSong.src);
    })



    //add event listener to Previous Play Next Button

    //add event listener to Play Button
    play.addEventListener("click", () => {
        let liImg = document.querySelector(".active .playnow img");
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
            liImg.src = "img/pause.svg"
            liImg.classList.add("invert")
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
            liImg.src = "img/play round.svg"
            liImg.classList.remove("invert")

        }
    })
    // add event listener Previous Button
    previous.addEventListener("click", () => {
        previousSong()
    })

    // add event listener to Next Button
    next.addEventListener("click", () => {
        nextSong()
    })
    //lisen for time update events
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".playbarTime").innerHTML = secondsToMinutesSeconds(currentSong.currentTime) + " / " + secondsToMinutesSeconds(currentSong.duration);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if (currentSong.ended) {
            nextSong()
        }
    })

    //add event listeners on seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        console.log(e.target.getBoundingClientRect().width, e.offsetX);
        let persent = (e.offsetX / e.target.getBoundingClientRect().width)
        document.querySelector(".circle").style.left = persent * 100 + "%";
        currentSong.currentTime = currentSong.duration * persent;

    })






    //add event listener on seekbar for drag and drop functionality
    // Elements
    const seekBar = document.querySelector(".seekbar");
    const circle = document.querySelector(".seekbar .circle");

    // Dragging State
    let isDragging = false; // Flag to track if dragging is active

    // Disable CSS Transition During Live Movement
    function disableTransition() {
        circle.style.transition = "none";
    }

    // Re-enable CSS Transition After Interaction
    function enableTransition() {
        circle.style.transition = ""; // Default transition from CSS
    }

    // Update Circle Position (Live)
    function updateCircle(positionX, seekBarRect) {
        let percent = Math.min(Math.max((positionX - seekBarRect.left) / seekBarRect.width, 0), 1); // Limit between 0 and 1
        circle.style.left = percent * 100 + "%"; // Update circle position
        return percent; // Return percentage for later use
    }

    // Mouse Events
    seekBar.addEventListener("mousedown", (e) => {
        const seekBarRect = seekBar.getBoundingClientRect(); // Get seek bar dimensions
        disableTransition(); // Disable transition for live movement
        isDragging = true; // Dragging starts

        // Function to handle live circle movement
        function onMouseMove(event) {
            updateCircle(event.clientX, seekBarRect);
        }

        // Start updating on movement
        document.addEventListener("mousemove", onMouseMove);

        // Update song position and cleanup on mouse release
        document.addEventListener("mouseup", (event) => {
            const percent = updateCircle(event.clientX, seekBarRect); // Final position update
            currentSong.currentTime = currentSong.duration * percent; // Update song position
            isDragging = false; // Dragging ends
            enableTransition(); // Re-enable transition
            document.removeEventListener("mousemove", onMouseMove); // Remove live update
        }, { once: true });
    });

    // Touch Events
    circle.addEventListener("touchstart", () => {
        const seekBarRect = seekBar.getBoundingClientRect(); // Get seek bar dimensions
        disableTransition(); // Disable transition for live movement
        isDragging = true; // Dragging starts

        // Function to handle live circle movement
        function onTouchMove(event) {
            const touchX = event.touches[0].clientX; // Get touch position
            updateCircle(touchX, seekBarRect);
        }

        // Start updating on movement
        document.addEventListener("touchmove", onTouchMove);

        // Update song position and cleanup on touch release
        document.addEventListener("touchend", (event) => {
            const touchX = event.changedTouches[0].clientX; // Get final touch position
            const percent = updateCircle(touchX, seekBarRect); // Final position update
            currentSong.currentTime = currentSong.duration * percent; // Update song position
            isDragging = false; // Dragging ends
            enableTransition(); // Re-enable transition
            document.removeEventListener("touchmove", onTouchMove); // Remove live update
        }, { once: true });
    });

    // Sync Circle with Song Progress
    function syncCircleWithSong() {
        if (!isDragging) { // Only update when not dragging
            const percent = currentSong.currentTime / currentSong.duration;
            circle.style.left = percent * 100 + "%";
        }
    }

    // Update circle position continuously as the song plays
    currentSong.addEventListener("timeupdate", syncCircleWithSong);








    //add event listener on Volume bar
    document.querySelector(".volume-bar").addEventListener("change", (e) => {
        let vol = parseInt(e.target.value) / 100;
        currentSong.volume = vol;
        if (vol == 0) {
            document.querySelector(".volume img").src = "img/mute.svg"
        } else {
            document.querySelector(".volume img").src = "img/volume.svg"
        }
    })

    //add event listener on Volume icon
    document.querySelector(".volume img").addEventListener("click", () => {
        let vol = document.querySelector(".volume-bar");
        let volimg = document.querySelector(".volume img");
        if (vol.value == 0) {
            vol.value = 100;
            currentSong.volume = 1;
            volimg.src = "img/volume.svg"
        } else {
            vol.value = 0;
            currentSong.volume = 0;
            volimg.src = "img/mute.svg"
        }
    })

    //add event Listner to Hmaburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })
    //add event Listner to Close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

}
main();
