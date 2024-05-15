// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
// import { doc, getFirestore, collection, getDocs, getAggregateFromServer ,sum,getDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"

// const firebaseConfig = {
//     apiKey: "AIzaSyDXIajxTK_g31he872G4xnM-nlZ9cmfz6k",
//     authDomain: "bigg-boss-voting-zone.firebaseapp.com",
//     databaseURL: "https://bigg-boss-voting-zone-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "bigg-boss-voting-zone",
//     storageBucket: "bigg-boss-voting-zone.appspot.com",
//     messagingSenderId: "798018597331",
//     appId: "1:798018597331:web:bc3f21b7e43acdffd2ff26",
//     measurementId: "G-NPR5T4V3E6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// // Get the progress bars container

// // Get the vote count data from Firebase
// const coll = collection(db, "votecount");
// const querySnapshot = await getDocs(collection(db, "votecount"));
// const snapshot1 = await getAggregateFromServer(coll, {
//     week1: sum("week1")
// });
// const sum1 = snapshot1.data().week1;

// const snapshot2 = await getAggregateFromServer(coll, {
//     week2: sum("week2")
// });
// const sum2 = snapshot2.data().week2;

// const snapshot3 = await getAggregateFromServer(coll, {
//     week3: sum("week3")
// });
// const sum3 = snapshot3.data().week3;

// const snapshot4 = await getAggregateFromServer(coll, {
//     week4: sum("week4")
// });
// const sum4 = snapshot4.data().week4;

// const snapshot5 = await getAggregateFromServer(coll, {
//     week5: sum("week5")
// });
// const sum5 = snapshot5.data().week5;

// const snapshot6 = await getAggregateFromServer(coll, {
//     week6: sum("week6")
// });
// const sum6 = snapshot6.data().week6;

// const snapshot7 = await getAggregateFromServer(coll, {
//     week7: sum("week7")
// });
// const sum7 = snapshot7.data().week7;

// const snapshot8 = await getAggregateFromServer(coll, {
//     week8: sum("week8")
// });
// const sum8 = snapshot8.data().week8;

// const snapshot9 = await getAggregateFromServer(coll, {
//     week9: sum("week9")
// });
// const sum9 = snapshot9.data().week9;

// const snapshot10 = await getAggregateFromServer(coll, {
//     week10: sum("week10")
// });
// const sum10 = snapshot10.data().week10;

// const snapshot11 = await getAggregateFromServer(coll, {
//     week11: sum("week11")
// });
// const sum11 = snapshot11.data().week11;

// const snapshot12 = await getAggregateFromServer(coll, {
//     week12: sum("week12")
// });
// const sum12 = snapshot12.data().week12;

// const snapshot13 = await getAggregateFromServer(coll, {
//     week13: sum("week13")
// });
// const sum13 = snapshot13.data().week13;

// const snapshot14 = await getAggregateFromServer(coll, {
//     week14: sum("week14")
// });
// const sum14 = snapshot14.data().week14;

// const snapshot15 = await getAggregateFromServer(coll, {
//     week15: sum("week15")
// });
// const sum15 = snapshot15.data().week15;

// const totalsum = sum1 + sum2  + sum3 + sum4 + sum5 + sum6  + sum7 + sum8 + sum9 + sum10  + sum11 + sum12 + sum13 + sum14 + sum15;

// console.log(totalsum); // total sum of all votes

// const docRef = doc(db, "votecount", "Aishwarya");
// const docSnap = await getDoc(docRef);

// const contestantsum = docSnap.data().week1 + docSnap.data().week2 + docSnap.data().week3  +  docSnap.data().week4 + docSnap.data().week5 + docSnap.data().week6 + docSnap.data().week7 + docSnap.data().week8 + docSnap.data().week9 + docSnap.data().week10 + docSnap.data().week11 + docSnap.data().week12 + docSnap.data().week13 + docSnap.data().week14 + docSnap.data().week15;

// console.log(contestantsum); //sum of votes for a contestant

var followers = 20000;
var total = 20000;
var likePerc = (followers/total)*100;

$(document).ready(function() {
    $(".bar").css("width", likePerc);
});