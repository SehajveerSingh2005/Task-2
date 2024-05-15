import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { doc, getFirestore, collection, getDocs,setDoc,addDoc,where,query} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"
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

    const btns = document.getElementById("btns");
    const profiledrop = document.getElementById( 'profiledropdown' );

    if (user) {
        btns.style.display = 'none';
        profiledrop.style.display='block';
        const userId = user.uid;
        fetchUsernameandpfp(userId);
    }
    else{
        btns.style.display = 'flex';
        profiledrop.style.display = 'none';
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

function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
    console.log('active');
  }

const profile = document.getElementById("profile");

profile.addEventListener( "click", menuToggle);