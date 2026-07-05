function animateTrain() {
  const trainContainer = document.createElement('div');
  const trainImage = document.createElement('img');

 
  trainContainer.style.position = 'fixed';
  trainContainer.style.left = '0';
  trainContainer.style.width = '100%';
  trainContainer.style.height = '200px';
  trainContainer.style.overflow = 'hidden';
  trainContainer.style.zIndex = '500';
  trainContainer.style.top = '50px'; 

 
  trainImage.src = 'resources/7.png'; 
  trainImage.alt = 'Train';
  trainImage.style.position = 'absolute';
  trainImage.style.height = '100%';
  trainImage.style.width = 'auto';
  trainImage.style.left = '-100%'; 

  
  trainContainer.appendChild(trainImage);

  document.body.prepend(trainContainer);


  let position = -trainImage.offsetWidth; 
  const animationSpeed = 6; 
  let passCount = 0;
  const maxPasses = 1; 

  function moveTrain() {
    position += animationSpeed;
    trainImage.style.left = position + 'px';

  
    if (position > window.innerWidth) {
      position = -trainImage.offsetWidth;
      passCount++;

    
      if (passCount >= maxPasses) {
        trainContainer.remove(); 
        return; 
      }
    }

    requestAnimationFrame(moveTrain);
  }

  moveTrain(); 
}


window.addEventListener('load', animateTrain);

const openBtn = document.getElementById('open-popup');
const closeBtn = document.getElementById('close-popup');
const popup = document.getElementById('phone-popup');

// Otwieranie pop-upu
openBtn.addEventListener('click', () => {
    popup.classList.add('active');
});

// Zamykanie przez kliknięcie w X
closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});

// Zamykanie przez kliknięcie w szare tło poza okienkiem
window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('active');
    }
});
