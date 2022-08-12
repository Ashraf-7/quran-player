function getEl(selector, isList = 0) {
  if (isList === 0) return document.querySelector(selector)
  if (isList === 1) return document.querySelectorAll(selector)
}

let audio = getEl('#quranPlayer')
let surahsContainer = getEl('#surahs')
let ayah = getEl('.ayah')
let next = getEl('.next')
let prev = getEl('.prev')
let play = getEl('.play')
getSurahs();

function getSurahs() {
  fetch("https://api.quran.sutanlab.id/surah")
    .then((response) => response.json())
    .then(data => {
      for (let surah in data.data) {
        surahsContainer.innerHTML += `<div>
        <p>${data.data[surah].name.long}</p>
        <p>${data.data[surah].name.transliteration.en}</p>
          <p class="revelation"n>${data.data[surah].revelation.arab} | ${data.data[surah].revelation.en}</p>
          </div>`;
          
          //   tafsirContainer.innerHTML += `<div>
          //   <p>${data.data[surah].name.long}</p>
        //   <p>${data.data[surah].name.transliteration.en}</p>
        // </div>`;
      }
      let allSurahs = getEl("#surahs div", 1);
      let ayahsAudio = [];
      let ayahsText = [];
      let ayahsTafsir = [];
      
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              let verses = data.data.verses;
              ayahsAudio = [];
              ayahsText = [];
              verses.forEach((verse) => {
                ayahsAudio.push(verse.audio.primary);
                ayahsText.push(verse.text.arab);
                // ayahsTafsir.push(verse.tafsir.id.short);
              });

              let ayahIndex = 0;
              changeAyah(ayahIndex);

              audio.addEventListener("ended", () => {
                ayahIndex++;
                if (ayahIndex < ayahsAudio.length) changeAyah(ayahIndex);
                else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                  audio.pause();
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Surah has been ended",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  isPlaying = true;
                  toggleAudio();
                }
              });

              next.addEventListener("click", nextAudio);
              play.addEventListener("click", toggleAudio);
              prev.addEventListener("click", prevAudio);

              let isPlaying = false;
              toggleAudio();
              // Play handler
              function toggleAudio() {
                if (isPlaying) {
                  audio.pause();
                  play.innerHTML = '<i class="fa-solid fa-play"></i>';
                  isPlaying = false;
                } else {
                  audio.play();
                  play.innerHTML = '<i class="fa-solid fa-pause"></i>';
                  isPlaying = true;
                }
              }

              // Next handler
              function nextAudio() {
                ayahIndex < ayahsAudio.length - 1
                  ? ayahIndex++
                  : (ayahIndex = 0);
                changeAyah(ayahIndex);
                // else next.classList.add('disabled')
              }
              // Previous handler
              function prevAudio() {
                ayahIndex !== 0
                  ? ayahIndex--
                  : (ayahIndex = ayahsAudio.length - 1);
                changeAyah(ayahIndex);
              }

              // Change ayah audio and text
              function changeAyah(index) {
                ayah.textContent = ayahsText[index];
                audio.src = ayahsAudio[index];
              }
            });
        });
      });
    });
}

// Tafsir list
let tafsirContainer = getEl("#tafsirContainer");
let tafsirIcon = getEl("#tafsirIcon");

  tafsirIcon.addEventListener("click", () => {
    toggleTafsir();
    
      // fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     let verses = data.data.verses
      //     ayahsText = []
      //     ayahsTafsir = []
      //     verses.forEach(verse => {
      //       tafsirContainer.innerHTML += `<div>
      //       <p>${verse.text.arab}</p>
      //       <p>${verse.tafsir.id.short}</p>
      //       </div>`;
      //       ayahsText.push(verse.text.arab);
      //       ayahsTafsir.push(verse.tafsir.id.short);
      //     })
      //   })
  });

  function toggleTafsir() {
    if (tafsirContainer.classList.contains("open")) {
      tafsirContainer.classList.remove("open")
      tafsirIcon.innerHTML = `<i class="fa-solid fa-sliders"></i>`
    } else {
      tafsirContainer.classList.add("open")
      tafsirIcon.innerHTML = `<i class="fa-solid fa-times"></i>`
    }
  }