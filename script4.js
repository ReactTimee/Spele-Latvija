document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('quizTitle').style.display = 'none'; 
    updateLivesDisplay(); 
    loadQuestion(); 
  });
  let score = 0;
  let lives = 3; 
  let timerId; 
  const questionTimeout = 20; 
  
  async function loadQuestion() {
    clearTimeout(timerId); 
  
    if (lives > 0) {
        try {
            const response = await fetch("http://localhost:3000/generate-cities-question");
            const data = await response.json();
            document.getElementById('question').innerText = data.question;
  
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = ''; 
  
            data.choices.filter(choice => choice.trim() !== '').forEach(choice => {
                const isCorrect = choice.trim().endsWith('*');
                const choiceText = isCorrect ? choice.trim().slice(0, -1) : choice.trim();
  
                const button = document.createElement("button");
                button.innerText = choiceText;
                button.isCorrect = isCorrect;
                button.classList.add("btn", "btn-outline-primary", "mb-2", "w-100");
                button.addEventListener("click", function() {
                    clearTimeout(timerId); 
                    handleAnswer(this, optionsContainer); 
                });
                optionsContainer.appendChild(button);
            });
            setupTimer();
  
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    } else {
        setTimeout(() => window.location.href = 'index.html', 1500);
    }
  }
  
  function handleAnswer(selectedButton, optionsContainer) {
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
        if (button.isCorrect) {
            button.classList.remove("btn-outline-primary");
            button.classList.add("btn-success"); 
        } else {
            button.classList.add("btn-danger"); 
        }
    });
  
    if (!selectedButton.isCorrect) {
        lives--; 
        updateLivesDisplay(); 
        setTimeout(loadQuestion, 1500); 
    } else {
      score++
      updateScoreDisplay()
        setTimeout(loadQuestion, 1500); 
    }
  }
  
  function setupTimer() {
    const timerDisplay = document.getElementById("timerDisplay");
    let timeLeft = questionTimeout;
    timerDisplay.textContent = `${timeLeft} sekundes atlikušas`;
  
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft} sekundes atlikušas`;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerDisplay.textContent = "Laiks beidzās!";
            handleNoAnswer(); 
        }
    }, 1000); 
  }
  
  function handleNoAnswer() {
    const optionsContainer = document.getElementById("options");
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
        if (button.isCorrect) {
            button.classList.remove("btn-outline-primary");
            button.classList.add("btn-success");
        } else {
            button.classList.add("btn-danger");
        }
    });
  
    lives--;
    updateLivesDisplay(); 
    alert("Laiks beidzās");
    setTimeout(loadQuestion, 1500);
  }
  
  function updateLivesDisplay() {
    const livesContainer = document.getElementById("lives");
    livesContainer.innerHTML = ""; 
    for (let i = 0; i < lives; i++) {
        const heartIcon = document.createElement("span");
        heartIcon.innerHTML = "&#10084;";
        livesContainer.appendChild(heartIcon);
    }
  }
  function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `Score: ${score}`; 
  }