import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { doc, getFirestore, collection, getDocs, getAggregateFromServer ,sum,where,query} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"
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

function updateProfileMenu(userName,pfp) {
  const menuElement = document.getElementById('profiledropdown').querySelector('.menu h3');
  const profilepic  = document.getElementById('profilepic');
  menuElement.textContent = userName;
  profilepic.src = pfp;
}

onAuthStateChanged(auth,(user)=>{

const profiledrop = document.getElementById( 'profiledropdown' );

if (user) {
    profiledrop.style.display='block';
    const userId = user.uid;
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
const username = doc.data().Username;
const pfp = doc.data().imageurl;
updateProfileMenu(username,pfp);
});
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

signoutbtn.addEventListener( 'click', signOutUser, false ) ;
// Loop through the query snapshot and create progress bars

function menuToggle() {
const toggleMenu = document.querySelector(".menu");
toggleMenu.classList.toggle("active");
console.log('active');
}

const profile = document.getElementById("profile");

profile.addEventListener( "click", menuToggle);

const videoElements = document.querySelectorAll('video');  // Select all video elements

// Function to create and show the modal
function showVideoModal(videoElement) {
  // Create the modal elements (div and iframe)
  const modalDiv = document.createElement('div');
  modalDiv.classList.add('video-modal');
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', videoElement.src);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', 'true');
    const title=document.createElement('p');
    title.textContent=videoElement.id;
    title.classList.add("title");
    title.innerHTML="Title: "+videoElement.id;
    iframe.appendChild(title);
  // Append the iframe to the modal div
  modalDiv.appendChild(iframe);

  // Add a click event listener to the modal div to close it
  modalDiv.addEventListener('click', function() {
    this.remove();
  });

  // Append the modal div to the body
  document.body.appendChild(modalDiv);
}

videoElements.forEach(video => {
  video.addEventListener('click', function() {
    showVideoModal(this);  // Use `this` to reference the clicked video element
  });
});