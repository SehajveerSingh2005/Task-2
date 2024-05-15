import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { doc, getFirestore, collection, getDocs, getAggregateFromServer ,sum,where,query, updateDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage,ref,uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
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
const storage = getStorage()
const votedref = collection(db, "votedfor");
const userRef = collection(db,"users");

let username;
let userId;
let email;
let phone;

const loadingScreen = document.getElementById('loading-screen');
loadingScreen.style.display = 'none';

function updateProfileMenu(userName,emailid,phn,pfp) {
    const menuElement = document.getElementById('profiledropdown').querySelector('.menu h3');
    const userprofilename = document.getElementById("username");
    const emailelement = document.getElementById("email");
    const numberelement = document.getElementById("phn");
    const  profilepic = document.getElementById("imageid");
    menuElement.textContent = userName;
    userprofilename.textContent = userName;
    emailelement.textContent = emailid;
    numberelement.textContent = phn;
    profilepic.src=pfp;
  }

function updateeditpfp(pfp){
  const imgel = document.getElementById('imageid2');
  imgel.src = pfp;
}

function updatenavpfp(pfp){
  const imgel = document.getElementById('imageid3');
  imgel.src = pfp;
}

onAuthStateChanged(auth,(user)=>{

    const profiledrop = document.getElementById( 'profiledropdown' );
    loadingScreen.style.display = 'block';
  
    if (user) {
        loadingScreen.style.display = 'none';
        profiledrop.style.display='block';
        userId = user.uid;
        fetchUserinfo(userId);

    }
    else{
        window.location.href = 'signup.html';
    }
  })

  async function fetchUserinfo(userId,email,phone,pfp) { 
  
    const q = query(collection(db,'users'), where("UID","==",userId)) // Access the user document based on ID
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    username = doc.data().Username;
    email = doc.data().Email;
    phone = doc.data().Phone;
    pfp = doc.data().imageurl;
    updateProfileMenu(username,email,phone,pfp);
    updateeditpfp(pfp);
    updatenavpfp(pfp);
  });
  retrieveVotedforData();
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

  function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
    console.log('active');
  }
  
  const profile = document.getElementById("profile");
  
  profile.addEventListener( "click", menuToggle);

async function retrieveVotedforData(){
    const q = query(collection(db,'votedfor'),where("UID","==",userId))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc)=> {
        const votedForData = doc.data();
        console.log(votedForData);
        const votedHistoryContainer = document.getElementById('voted-history')
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card2');

        // Username (optional)
        const userNameElement = document.createElement('h1');
        userNameElement.classList.add('name2');
        userNameElement.textContent = `Dear ${votedForData.Username}`; // Assuming username exists
        cardDiv.appendChild(userNameElement);

        // Voted For
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        const descP = document.createElement('p');
        descP.textContent = 'You\'ve voted for';
        descDiv.appendChild(descP);
        cardDiv.appendChild(descDiv);

        const voteDiv = document.createElement('div');
        voteDiv.classList.add('vote');
        const voteP = document.createElement('p');
        voteP.textContent = votedForData.contestant;
        voteDiv.appendChild(voteP);
        cardDiv.appendChild(voteDiv);

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('time');
        const timeP = document.createElement('p');
        timeP.textContent = votedForData.time;
        timeDiv.appendChild(timeP);
        cardDiv.appendChild(timeDiv);

        votedHistoryContainer.appendChild(cardDiv);
    })
}

const editbtn = document.getElementById('file');
editbtn.addEventListener('change',uploadimage);

function uploadimage(){
  const file = document.getElementById('file').files[0];
  if (!file){
    return;
  }
  const storageRef = ref(storage,file.name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  const progressBar = document.createElement('progress');
  progressBar.value = 0; // Initial progress
  progressBar.max = 100; // Set maximum value
  progressBar.classList.add('progressbar');

  // Add the progress bar to the DOM (adjust this based on your HTML structure)
  document.getElementById('progress-container').appendChild(progressBar); 

  let progressValue = 0; // Keep track of simulated progress

  const updateProgress = () => {
    if (progressValue < 100) {
      progressValue += 1; // Increase simulated progress by a small amount
      progressBar.value = progressValue;
    } else {
      clearInterval(intervalId); // Stop updates when progress reaches 100%
    }
  };

  const intervalId = setInterval(updateProgress, 50); // Update progress every 50 milliseconds (adjust as needed)

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    progressBar.value = progress;

    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    clearInterval(intervalId);
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      replacepfp(downloadURL)
      urltodb(downloadURL)
    });
    progressBar.remove();
  }
);
}

function replacepfp(URL){
  const imageel = document.getElementById('imageid');
  const imageel2 = document.getElementById('imageid2');
  const imageel3 = document.getElementById('imageid3');
  imageel.src = URL;
  imageel2.src = URL;
  imageel3.src = URL;
  alert("Profile Picture Changed Successfully");
}


async function urltodb(URL) {

  try {
    const userRef = query(collection(db, 'users'), where('UID', '==', userId));
    const snapshot = await getDocs(userRef);

    // Check if user document exists before updating
    if (snapshot.empty) {
      console.error('User document not found in Firestore');
      // Handle the case where the user document doesn't exist
      return;
    }

    const userDoc = snapshot.docs[0];
    await updateDoc(userDoc.ref, {
      imageurl: URL
    });
  } catch (error) {
    console.error('Error updating user profile picture in Firestore:', error);
    // Handle errors appropriately, e.g., display an error message to the user
  }
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var signupForm;

function showErrorMessage(message) {
  alert(message); // You can replace this with a more user-friendly approach
}

// function displayconfirm(){
//   const editbtn = document.getElementById('confirmpfpbtn');
//   editbtn.style.display='flex';
// }


// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";

  // code to get the info and update
  signupForm  = document.querySelector( '.editform' );

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('usernameform').value;
  const email = document.getElementById('emailform').value;
  const phn = document.getElementById('phnform').value;
  // const pwd = document.getElementById('pwd').value;
  console.log(username,email,phn);
  try {
    const userRef = query(collection(db, 'users'), where('UID', '==', userId));
    const snapshot = await getDocs(userRef);

    // Store user details in Firestore
    const userDoc = snapshot.docs[0];
    await updateDoc(userDoc.ref, {
      Username: username,
      Email: email,
      Phone: phn
    });
    alert('Profile updated successfully!');
    location.reload();
  } catch (error) {
    console.error(error.code, error.message);
    showErrorMessage("Failed. Please check your details and try again.");
  }
});
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


const votedHistoryContainer = document.getElementById('voted-history');
votedHistoryContainer.addEventListener('click', (event) => {
  const clickedElement = event.target;
  if (clickedElement.classList.contains('card2')) {
    // User clicked on a card
    const cardElement = clickedElement;
    const platform = prompt('Share on (facebook/instagram):');
    if (platform === 'facebook' || platform === 'instagram') {
      shareCard(cardElement, platform);
    } 
    else {
      alert('Invalid platform. Please choose facebook or instagram.');
    }
  }
});

function shareCard(cardElement, platform) {
  html2canvas(cardElement, { logging: false })
    .then(canvas => {
      const imageDataUrl = canvas.toDataURL('image/png');
      console.log(imageDataUrl);

        uploadImage(imageDataUrl)
    .then((snapshot) => {
      console.log('Image uploaded successfully!');
      // Get the download URL from the upload task
      const timelineimg = snapshot.ref.getDownloadURL();
      // Use the downloadURL for sharing on Facebook
      console.log(timelineimg);
    })
    .catch((error) => {
      console.error('Error uploading image:', error);
    });
      // Sharing logic based on platform
      if (platform === 'facebook') {
        // Use Facebook Share Dialog with imageDataUrl
        // FB.ui({
        //   method: 'share',
        //   href: window.location.href, // Share current page URL
        //   picture: imageDataUrl
        // }, response => console.log(response));
        // const ogImageMeta = document.querySelector('#ogimage');
        // ogImageMeta.content = imageDataUrl;
        // console.log(ogImageMeta);

        FB.ui({
          method: 'share',
          href: timelineimg
          }, function (response) {
          console.log(response);
        })
      } else if (platform === 'instagram') {
        const instagramDeepLink = `https://www.instagram.com/?link=${encodeURIComponent(window.location.href)}`;
        console.log(instagramDeepLink);
        try {
          window.open(instagramDeepLink, '_blank');
        } catch (error) {
          alert('Instagram app not found or deep linking failed. Please try sharing manually.');
          // Additional options for fallback:
          // - Display instructions for manual sharing
          // - Offer a button to download the card image
        }
      }
    })
    .catch(error => console.error('Error creating card image:', error));
}

function createInstagramShareUrl(imageDataUrl) {
  // Construct the base Instagram sharing URL
  const baseShareUrl = 'instagram-stories://share';

  // Compose query parameters, prioritizing card image if available
  // and falling back to page link if image generation fails
  const queryParams = imageDataUrl
      ? `u=${encodeURIComponent(imageDataUrl)}` // Share card image directly
      : `link=${encodeURIComponent(window.location.href)}`; // Fallback to page link

  return `${baseShareUrl}${queryParams}`;
}

function uploadImage(base64Image) {
  // Create a unique filename (optional)
  const storageRef = ref(storage,file.name);
  const uploadTask = uploadBytesResumable(storageRef, base64Image);
  const filename = Math.random().toString(36).substring(2, 15) + '.png';
  const imageRef = storageRef.child(filename);

  // Upload the Base64 string as data_url
  imageRef.putString(base64Image, 'data_url');

  uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');

    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    clearInterval(intervalId);
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);

    });
  }
);
}
