// Menyeleksi elemen-elemen DOM
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text span");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanParts = document.querySelectorAll(".figure-part");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again-btn");
const modalTitle = document.getElementById("modal-title");
const correctWordEl = document.getElementById("correct-word");

// Variabel Game
let currentWord, correctLetters, wrongGuesses;
const maxGuesses = 6;

// Daftar Kata (Sederhana)
// Kamu bisa menambahkan kata lain di sini
const wordList = [
    { word: "apel", hint: "Buah yang sering dihubungkan dengan Newton." },
    { word: "pisang", hint: "Buah berwarna kuning dan panjang." },
    { word: "gitar", hint: "Alat musik petik dengan senar." },
    { word: "kucing", hint: "Hewan peliharaan yang suka mengeong." },
    { word: "matahari", hint: "Bintang di pusat tata surya kita." },
    { word: "javascript", hint: "Bahasa pemrograman untuk web." },
];

// Fungsi untuk mereset game
const resetGame = () => {
    // Reset semua variabel game
    correctLetters = [];
    wrongGuesses = 0;
    
    // Pilih kata acak dari wordList
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = randomWord.word;

    // (Opsional: Tampilkan hint)
    // console.log(randomWord.hint); 

    // Reset tampilan
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    guessesText.innerText = `${wrongGuesses} / ${maxGuesses}`;
    
    // Sembunyikan bagian tubuh hangman
    hangmanParts.forEach(part => part.style.display = "none");
    
    // Aktifkan kembali semua tombol keyboard
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    
    // Sembunyikan modal
    gameModal.classList.remove("show");
};

// Fungsi untuk mendapatkan kata acak dan memulai game
const getRandomWord = () => {
    resetGame();
};

// Fungsi untuk menampilkan modal game over (menang/kalah)
const gameOver = (isVictory) => {
    setTimeout(() => {
        if (isVictory) {
            modalTitle.innerText = "Kamu Menang!";
        } else {
            modalTitle.innerText = "Game Over!";
        }
        correctWordEl.innerText = currentWord;
        gameModal.classList.add("show");
    }, 300); // Tunda sedikit agar user bisa melihat tebakan terakhir
};

// Fungsi utama yang dipanggil saat tombol keyboard diklik
const initGame = (e) => {
    const clickedLetter = e.target.innerText.toLowerCase();
    
    // Nonaktifkan tombol yang sudah diklik
    e.target.disabled = true;

    // Cek apakah huruf yang diklik ada di kata
    if (currentWord.includes(clickedLetter)) {
        // Jika ada (tebakan benar)
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                // Tampilkan huruf di posisi yang benar
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Jika tidak ada (tebakan salah)
        wrongGuesses++;
        // Tampilkan bagian tubuh hangman
        hangmanParts[wrongGuesses - 1].style.display = "block";
    }

    // Update info tebakan salah
    guessesText.innerText = `${wrongGuesses} / ${maxGuesses}`;

    // Cek status game (menang/kalah)
    if (wrongGuesses === maxGuesses) return gameOver(false); // Kalah
    if (correctLetters.length === currentWord.length) return gameOver(true); // Menang
};

// Membuat tombol-tombol keyboard secara dinamis
for (let i = 97; i <= 122; i++) { // ASCII untuk a-z
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e));
}

// Memulai game saat halaman dimuat
getRandomWord();

// Event listener untuk tombol "Main Lagi"
playAgainBtn.addEventListener("click", getRandomWord);