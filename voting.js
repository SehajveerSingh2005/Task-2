import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"
import { doc, setDoc,updateDoc,increment,where,query,getDocs,collection,addDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDXIajxTK_g31he872G4xnM-nlZ9cmfz6k",
  authDomain: "bigg-boss-voting-zone.firebaseapp.com",
  databaseURL: "https://bigg-boss-voting-zone-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bigg-boss-voting-zone",
  storageBucket: "bigg-boss-voting-zone.appspot.com",
  messagingSenderId: "798018597331",
  appId: "1:798018597331:web:bc3f21b7e43acdffd2ff26",
  measurementId: "G-NPR5T4V3E6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let username;
let cardId;

// Get reference to individual divs
const cards = document.querySelectorAll('.card');
let selectedcard = null;
const loadingScreen = document.getElementById('loading-screen');
loadingScreen.style.display = 'none';

function updateProfileMenu(userName,pfp) {
  const menuElement = document.getElementById('profiledropdown').querySelector('.menu h3');
  const profilepic  = document.getElementById('profilepic');
  menuElement.textContent = userName;
  profilepic.src = pfp;
}

async function addtovotedfor(uid,userName,cardid){
  
  await addDoc(collection(db, "votedfor"), {
    UID: uid,
    Username: userName,
    contestant: cardid,
    time: new Date().toLocaleString()
  });
}

let userId;

onAuthStateChanged(auth,(user)=>{

  loadingScreen.style.display = 'block';
  const profiledrop = document.getElementById( 'profiledropdown' );

  if (user) {
      loadingScreen.style.display = 'none';
      profiledrop.style.display='block';
      userId = user.uid;
      fetchUsernameandpfp(userId);
  }
  else{
      window.location.href = 'signup.html';
  }
})

async function fetchUsernameandpfp(userId) { 
  
  const q = query(collection(db,'users'), where('UID',"==",userId)) // Access the user document based on ID

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  username = doc.data().Username;
  const pfp = doc.data().imageurl;
  updateProfileMenu(username,pfp);
});
}


// Add click event listener to each individual to handle selection
cards.forEach((card) => {
  card.addEventListener('click', () => {
      if (selectedcard) {
          selectedcard.classList.remove('selected');
      }
      selectedcard = card;
      selectedcard.classList.add('selected');
  });
});

const votebtn = document.getElementById("votebtn")
const voteddiv = document.getElementById('votedmsg')

function thanksforvote(){
  voteddiv.classList.add('msg')

  setTimeout(function(){
    voteddiv.classList.remove('msg');
  },5000);
}

function disablebtn(){
  votebtn.classList.add('disable')

  setTimeout(function(){
    votebtn.classList.remove('disable');
  },5000);
}

votebtn.addEventListener("click",castvote);

function castvote() {
  if (!selectedcard) {
      alert('Please select a contestant to vote.');
      return;
  }

  cardId = selectedcard.id;
  const votecountRef = doc(db,"votecount",cardId)

  updateDoc(votecountRef,{
    week15: increment(1)
  })
  thanksforvote();
  addtovotedfor(userId,username,cardId);
  disablebtn();
}

const signOutUser = () => {
  auth.signOut().then(() => {
      // Sign-out successful.
      console.log('User signed out successfully');
      // You can redirect the user to another page or perform any other actions after sign-out
  }).catch((error) => {
      // An error happened.
      console.error('Sign-out error:', error);
  });
};

const signoutbtn = document.getElementById( 'signoutbtn' );
const signoutbtn_m = document.getElementById('signoutbtn_m')

signoutbtn.addEventListener( 'click', signOutUser, false ) ;
signoutbtn_m.addEventListener( 'click', signOutUser, false ) ;

function updateTimer() {
  const currentTime = new Date();
  const stopTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 22, 0); // 10pm stop time

  // Calculate remaining milliseconds until stop time
  let remainingTime = stopTime.getTime() - currentTime.getTime();

  // Check if timer has stopped (past 10pm)
  if (remainingTime <= 0) {
    remainingTime = 0; // Set to 0 to avoid negative values
  }

  // Convert remaining milliseconds to hours, minutes, and seconds
  const hours = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  // Format time string with leading zeros for visual consistency
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update timer display
  const timerElement = document.getElementById("countdown-timer");
  timerElement.textContent = `Time remaining: ${formattedTime}`;

  // Schedule next update (adjust interval as needed)
  const disablebutton = document.getElementById("votebtn");
  disablebutton.disabled = (remainingTime <= 0);
  setTimeout(updateTimer, 1000); // Update every second
}

// Call updateTimer on page load
updateTimer();

function menuToggle() {
  const toggleMenu = document.querySelector(".menu");
  toggleMenu.classList.toggle("active");
  console.log('active');
}

const profile = document.getElementById("profile");

profile.addEventListener( "click", menuToggle);