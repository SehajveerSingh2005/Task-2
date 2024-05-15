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
const coll = collection(db, "votecount");

const querySnapshot = await getDocs(collection(db, "votecount"));
// Get the progress bars container
const container = document.getElementById('progressBarsContainer');
let selectedOptionId = 'week1'; 
const loadingScreen = document.getElementById('loading-screen');
loadingScreen.style.display = 'none';

function updateProfileMenu(userName,pfp) {
    const menuElement = document.getElementById('profiledropdown').querySelector('.menu h3');
    const profilepic  = document.getElementById('profilepic');
    menuElement.textContent = userName;
    profilepic.src = pfp;
  }

onAuthStateChanged(auth,(user)=>{

    const profiledrop = document.getElementById( 'profiledropdown' );
    loadingScreen.style.display = 'block';
  
    if (user) {
        loadingScreen.style.display = 'none';
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

async function retrieveVoteData(selectedOptionId){
    console.log("function called with:", selectedOptionId);
    const snapshot = await getAggregateFromServer(coll, {
        totalcount: sum(selectedOptionId)
    });

    container.innerHTML = "";

    querySnapshot.forEach(async (doc) => {
        const count = doc.data()[selectedOptionId];
        const perc = (count / snapshot.data().totalcount) * 100;
        
        // Create a progress bar element
        const progressBar = document.createElement('div');
        progressBar.classList.add('cont'); // Add the class 'cont' for styling
    
        // Set the percentage value as a data attribute
        progressBar.setAttribute('data-pct', perc.toFixed(1));
    
        // Create an SVG element and link it to the progress bar
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '200');
    
        // Create the background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('r', '90');
        bgCircle.setAttribute('cx', '100');
        bgCircle.setAttribute('cy', '100');
        bgCircle.setAttribute('fill', 'transparent');
        bgCircle.setAttribute('stroke', '#666');
        bgCircle.setAttribute('stroke-width', '1em');
    
        // Create the progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.classList.add('bar'); // Add the class 'bar' for styling
        progressCircle.setAttribute('r', '90');
        progressCircle.setAttribute('cx', '100');
        progressCircle.setAttribute('cy', '100');
        progressCircle.setAttribute('fill', 'transparent');
        progressCircle.setAttribute('stroke-linecap','round');
        progressCircle.setAttribute('stroke-dasharray', '565.48');
        progressCircle.setAttribute('stroke-dashoffset', '0');
    
        const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        linearGradient.setAttribute('id', 'linear');
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '100%');
        linearGradient.setAttribute('y2', '0%');
    
        // Create stop elements for the linear gradient
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ffbd23');
    
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#fd7201');
    
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const image = document.createElement('img');
        image.classList.add(doc.id);
        image.setAttribute('src', doc.data().imageurl); // Replace with your image path
    
        imageContainer.appendChild(image);
        progressBar.appendChild(imageContainer);
      
        // Optional: Add name of the person below the bar
        const name = document.createElement('p');
        name.classList.add('names');
        name.textContent = doc.id; // Use document ID as name in this case
        
        
        progressBar.appendChild(name);
    
        // Append stop elements to linear gradient
        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
    
        // Append linear gradient to SVG element in progress bar
        svg.appendChild(linearGradient);
    
        // Append circles to the SVG element
        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);
    
        // Append the SVG element to the progress bar
        progressBar.appendChild(svg);
    
        // Append the progress bar to the container
        container.appendChild(progressBar);
    
        // Update the progress bar asynchronously
         updateProgressBar(progressBar);
    });

    async function updateProgressBar(progressBar) {
        const $circle = $(progressBar).find('.bar'); // Select the circle element with class 'bar' inside each '.cont' element
        const r = $circle.attr('r');
        const c = Math.PI * (r * 2);
    
        const val = parseFloat($(progressBar).attr('data-pct')); // Get the percentage value from 'data-pct' attribute
    
        const pct = ((100 - val) / 100) * c;
    
        $circle.css({ strokeDashoffset: pct });
        $circle.addClass('animate');
        
    }

    
}

async function retrieveDefaultData(){
    console.log("function called with:", selectedOptionId);
    const snapshot = await getAggregateFromServer(coll, {
        totalcount: sum('week15')
    });

    container.innerHTML = "";

    querySnapshot.forEach(async (doc) => {
        const count = doc.data().week15;
        const perc = (count / snapshot.data().totalcount) * 100;
        
        
        // Create a progress bar element
        const progressBar = document.createElement('div');
        progressBar.classList.add('cont'); // Add the class 'cont' for styling
    
        // Set the percentage value as a data attribute
        progressBar.setAttribute('data-pct', perc.toFixed(1));
    
        // Create an SVG element and link it to the progress bar
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '200');
    
        // Create the background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('r', '90');
        bgCircle.setAttribute('cx', '100');
        bgCircle.setAttribute('cy', '100');
        bgCircle.setAttribute('fill', 'transparent');
        bgCircle.setAttribute('stroke', '#666');
        bgCircle.setAttribute('stroke-width', '1em');
    
        // Create the progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.classList.add('bar'); // Add the class 'bar' for styling
        progressCircle.setAttribute('r', '90');
        progressCircle.setAttribute('cx', '100');
        progressCircle.setAttribute('cy', '100');
        progressCircle.setAttribute('fill', 'transparent');
        progressCircle.setAttribute('stroke-linecap','round');
        progressCircle.setAttribute('stroke-dasharray', '565.48');
        progressCircle.setAttribute('stroke-dashoffset', '0');
    
        const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        linearGradient.setAttribute('id', 'linear');
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '100%');
        linearGradient.setAttribute('y2', '0%');
    
        // Create stop elements for the linear gradient
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ffbd23');
    
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#fd7201');
    
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const image = document.createElement('img');
        image.classList.add(doc.id);
        image.setAttribute('src', doc.data().imageurl); // Replace with your image path
    
        imageContainer.appendChild(image);
        progressBar.appendChild(imageContainer);
      
        // Optional: Add name of the person below the bar
        const name = document.createElement('p');
        name.classList.add('names');
        name.textContent = doc.id; // Use document ID as name in this case
        
        
        progressBar.appendChild(name);
    
        // Append stop elements to linear gradient
        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
    
        // Append linear gradient to SVG element in progress bar
        svg.appendChild(linearGradient);
    
        // Append circles to the SVG element
        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);
    
        // Append the SVG element to the progress bar
        progressBar.appendChild(svg);
    
        // Append the progress bar to the container
        container.appendChild(progressBar);
    
        // Update the progress bar asynchronously
         updateProgressBar(progressBar);
    });
    
    async function updateProgressBar(progressBar) {
        const $circle = $(progressBar).find('.bar'); // Select the circle element with class 'bar' inside each '.cont' element
        const r = $circle.attr('r');
        const c = Math.PI * (r * 2);
    
        const val = parseFloat($(progressBar).attr('data-pct')); // Get the percentage value from 'data-pct' attribute
    
        const pct = ((100 - val) / 100) * c;
    
        $circle.css({ strokeDashoffset: pct });
        $circle.addClass('animate');
        
    }
    
}

retrieveDefaultData();

const select = document.querySelector(".select");
    const options_list = document.querySelector(".options-list");
    const options = document.querySelectorAll(".option");

    //show & hide options list
    select.addEventListener("click", () => {
      options_list.classList.toggle("active");
      select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
    });

    
    //select option
    options.forEach((option) => {
      option.addEventListener("click", async () => {
        options.forEach((option) => { option.classList.remove('selected') });
        select.querySelector("span").innerHTML = option.innerHTML;
        option.classList.add("selected");
        selectedOptionId = option.id;
        options_list.classList.toggle("active");
        select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");

        await retrieveVoteData(selectedOptionId);

        });
    });

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
// Loop through the query snapshot and create progress bars

function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
    console.log('active');
  }

const profile = document.getElementById("profile");

profile.addEventListener( "click", menuToggle);