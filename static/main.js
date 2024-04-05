import { $ } from "/static/jquery/src/jquery.js";

// Tab functions

// Geolocation functions

export function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");
  
    mapLink.href = "";
    mapLink.textContent = "";
  
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      status.textContent = "";
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }
  
    function error() {
      status.textContent = "Unable to retrieve your location";
    }
  
    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
}

// Notification functions
const serviceReg = await navigator.serviceWorker.getRegistration();
export const notificationButton = async () => {
    const serviceReg = await navigator.serviceWorker.getRegistration();
    const img = "/static/pwa_ico.png";
    const text = `Hello, here's a quick demonstration of how notifications can work`;
    // Browser support check
    if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
        return;
    }
    //const notifBtn = document.getElementsByClassName("notifButton");
    // If permission granted, send notification, if not, request it.
    if(Notification.permission === 'granted') {
        if(!serviceReg === false && 'showNotification' in serviceReg) {
            serviceReg.showNotification("Test Notif", {body:text, icon:img});
        }
        else {
            new Notification("Test Notif", {body:text, icon:img});
        }
        return;
    }
    if(Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        if(result === 'granted') {
            if(!serviceReg === false && 'showNotification' in serviceReg) {
                serviceReg.showNotification("Test Notif", {body:text, icon:img});
            }
            else {
                new Notification("Test Notif", {body:text, icon:img});
            }
        }
    }
}
  

// Touch canvas functions

const ongoingTouches = [];

export function handleStart(evt) {
    evt.preventDefault();
    log("touchstart.");
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");
    const touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      log(`touchstart: ${i}.`);
      ongoingTouches.push(copyTouch(touches[i]));
      const color = colorForTouch(touches[i]);
      log(`color of touch with id ${touches[i].identifier} = ${color}`);
      ctx.beginPath();
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
      ctx.fillStyle = color;
      ctx.fill();
    }
}

export function handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");
    const touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      const color = colorForTouch(touches[i]);
      const idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        log(`continuing touch ${idx}`);
        ctx.beginPath();
        log(
          `ctx.moveTo( ${ongoingTouches[idx].pageX}, ${ongoingTouches[idx].pageY} );`,
        );
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        log(`ctx.lineTo( ${touches[i].pageX}, ${touches[i].pageY} );`);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();
  
        ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      } else {
        log("can't figure out which touch to continue");
      }
    }
  }

  export function handleEnd(evt) {
    evt.preventDefault();
    log("touchend");
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");
    const touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      const color = colorForTouch(touches[i]);
      let idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
        ongoingTouches.splice(idx, 1); // remove it; we're done
      } else {
        log("can't figure out which touch to end");
      }
    }
  }

  function colorForTouch(touch) {
    let r = touch.identifier % 16;
    let g = Math.floor(touch.identifier / 3) % 16;
    let b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    const color = `#${r}${g}${b}`;
    return color;
  }
  

  export function handleCancel(evt) {
    evt.preventDefault();
    log("touchcancel.");
    const touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1); // remove it; we're done
    }
  }

  function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
  }
        
  export function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      const id = ongoingTouches[i].identifier;
  
      if (id === idToFind) {
        return i;
      }
    }
    return -1; // not found
  }
  export function log(msg) {
    const container = document.getElementById("log");
    container.textContent = `${msg} \n${container.textContent}`;
  }
  
  //