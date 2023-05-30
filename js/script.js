let gameRunning=false;

//const categories=["Sports", "Animals", "Science & Nature", "History", "Art"]

document.getElementById("startButton").addEventListener("click",setToken);
document.getElementById("resetButton").addEventListener("click",resetGame);


//var arr = {key1:'value1', key2:'value2'}

const categories={"Sports": 21, "Animals": 27, "Science & Nature": 17, "History": 23, "Art":25}

//categories[Object.keys(categories)[0]];

window.localStorage.setItem("fakeJepardyCategories", categories);

console.log(categories["Sports"])


function startGame(){
    //NEW
    //setToken()

    // fixr buttons
   // document.getElementById('startButton').disabled = true;

    document.getElementById('resetButton').disabled = false;


    populateBoard();
    document.getElementById("submitResponse").addEventListener("click", checkResponse)

     //add zero to score
     document.getElementById('total').innerHTML=0;

     //Update feedback
     document.getElementById('feedback').innerHTML="Select a question.";


}

function populateBoard(){



    var catDivs=document.getElementsByClassName("category");

    j=0;
    for (cat in categories){
        console.log(cat)
        console.log(categories[cat])
        catDivs[j].innerHTML=cat;
        j++;


    }



     var questions=document.getElementsByClassName("question");
     
     var start=10;


     for (var i = 0 ; i < questions.length; i++) {
         questions[i].addEventListener('click' ,loadQuestion) ; 
         questions[i].setAttribute('id', i);
         
         ceil=Math.ceil((i+1)/5)
         console.log(i)
         console.log(ceil)
         val=start*ceil;

         switch(val){
            case 10:
                questions[i].setAttribute("data-difficulty", "easy");
                break;
            case 20:
            case 30:
            case 40:
                questions[i].setAttribute("data-difficulty", "medium");
                break;               
            case 50:
                questions[i].setAttribute("data-difficulty", "hard");
                break;
         }

         var k= (i+5) % 5;
         console.log(k)
         var cid=categories[Object.keys(categories)[k]];
         questions[i].setAttribute("data-cat", cid);



         questions[i].innerHTML=val
      }



}






function viewQuestion(data){

    //var response=getQuestion(21, "easy");
    //console.log(response);
    

    //MOVE THIS TO loadQuestion
    //console.log(this.id)
    // If id is set earlier, saving it to local storage
   // window.localStorage.setItem("currentIndex", this.id);

   console.log(data.results[0]);

   var question=data.results[0].question;
   document.getElementById("questionArea").innerHTML="<p>"+question+"</p>";

   var correct=data.results[0].correct_answer;
   var allAnswers=data.results[0].incorrect_answers;
   allAnswers.push(correct)
   console.log(allAnswers)

   shuffled=shuffle(allAnswers)
   console.log(shuffled)
   radios=""

   var form=document.querySelector("#answerArea form");
   form.innerHTML="";
   console.log(form)
   for(i=0; i<shuffled.length; i++){

 
   // var entry=document.createElement("div");
    //var radio=document.createElement("input");
    //radio.setAttribute("type", "radio");
    //radio.setAttribute("name", "qa");
    if(shuffled[i]==correct){var val="correct"}
    else{var val="incorrect"};
    //radio.setAttribute("value", val);
    //radio.innerText=" "+shuffled[i]+" ";
    //entry.appendChild(radio)
    //form.appendChild(entry);
  
    var html="<div><input type='radio' name='qa' value='"+val+"'> "+ shuffled[i] +" </div>";
    radios+=html;




   }
   form.innerHTML=radios;


    // Get the modal
    // Not using var makes it global
    modal = document.getElementById("qaModal");

    // Get the <span> element that closes the modal
    var closeX = document.getElementsByClassName("close")[0];

    // Display modal
    modal.style.display = "block";
 
   // $("#qaModal").fadeIn("slow");



// When the user clicks on <span> (x), close the modal
    closeX.onclick = function() {
        modal.style.display = "none";
    }




}


function checkResponse(){
    
    //get correct answer
    var correct=document.querySelector("input[value=correct]").parentElement.textContent;
    console.log(correct)

    //get answer user checked
    var response=document.querySelector('input[name="qa"]:checked').value;
    console.log(response)

    
    //get point total, based on saved index
    var index=localStorage.getItem("currentIndex");
    var questions=document.getElementsByClassName("question");
    var points=Number(questions[index].textContent);



    //update score
    var total=Number(document.getElementById("total").textContent);
    if(response=="correct"){
        total=total+points;
        document.getElementById("feedback").innerHTML="Correct!";
    }
    if(response=="incorrect"){
        total=total-points;
        //display correct answer
        document.getElementById("feedback").innerHTML="Wrong. The correct answer is: "+correct;

    }

    document.getElementById("total").innerHTML=total;


    console.log(points)


    questions[index].innerHTML="";
    questions[index].removeEventListener("click", loadQuestion);


    modal.style.display = "none";
}

function resetGame(){

    //reset buttons
    document.getElementById('startButton').disabled = false;
    document.getElementById('resetButton').disabled = true;

    //update feedback
    document.getElementById("feedback").innerHTML="Click Start to begin.";

    //reset score
    document.getElementById("total").innerHTML="0";

    //remove category labels
    var catDivs=document.getElementsByClassName("category");
    for (var i = 0 ; i < catDivs.length; i++) {
        
        catDivs[i].innerHTML="";
     }

     //remove question labels and event listeners
     var questions=document.getElementsByClassName("question");

     for (var i = 0 ; i < questions.length; i++) {
         questions[i].removeEventListener('click' ,viewQuestion) ; 
         questions[i].removeAttribute('id');

         questions[i].innerHTML="";
      }


}

function setToken(){
    document.getElementById('startButton').disabled = true;


         //Update feedback
         document.getElementById('feedback').innerHTML="Loading...";

    $.ajax({
        method: "GET",
        url: "https://opentdb.com/api_token.php",
        data: { command: "request"}
      })
        .done(function( response ) {
          console.log(response.token);
            window.localStorage.setItem("apiToken", response.token);
            startGame();

    });


}


function loadQuestion(){

    //console.log(this)
    //save id here

    console.log(this.id)
    // If id is set earlier, saving it to local storage
    window.localStorage.setItem("currentIndex", this.id);

    category=21;
    var token=window.localStorage.getItem("apiToken");
    //sample: https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple

    //var diff="easy";
    var type="multiple";
    var current=document.getElementById(this.id);
    console.log(current);
    var diff=current.getAttribute("data-difficulty")
    var category=current.getAttribute("data-cat");
    console.log(category);
    console.log(diff);


    $.ajax({
        method: "GET",
        url: "https://opentdb.com/api.php",
        data: { amount: 1, type: "multiple", token:token, difficulty: diff, category: category }
      })
        .done(function(question) {
          //console.log(question);
          viewQuestion(question);
           
           

    });



}

/* borrowed from https://javascript.info/task/shuffle */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }



