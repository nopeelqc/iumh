document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const heart = document.createElement('div');
  heart.id = 'heart';
  heart.textContent = '💗';
  heart.style.fontSize = '220px';
  heart.style.textAlign = 'center';
  heart.style.cursor = 'pointer';

  const tapText = document.createElement('div');
  tapText.id = 'tapText';
  tapText.textContent = 'Tap!';

  intro.appendChild(heart);
  intro.appendChild(tapText);

  let tapCount = 0;
  let transitioned = false;

  heart.addEventListener('click', () => {
    tapCount++;
    const newSize = 220 + tapCount * 28;
    heart.style.fontSize = newSize + 'px';

    if (tapCount >= 10 && !transitioned) {
      transitioned = true;

      heart.style.animation = '';
      tapText.style.display = 'none';

      heart.style.transition = 'transform 0.5s ease-out';
      heart.style.transform = 'scale(4)';

      setTimeout(() => {
        heart.remove();

        let count = 0;
        const max = 30;
        const interval = 50;

        const spawnSmallHeart = () => {
          if (count >= max) return;
          const small = document.createElement('div');
          small.className = 'smallHeart';
          small.textContent = '💗';
          small.style.left = `${Math.random() * 100}%`;
          small.style.bottom = '0';
          small.style.fontSize = `${30 + Math.random() * 50}px`;
          document.body.appendChild(small);
          small.addEventListener('animationend', () => small.remove());
          count++;
          setTimeout(spawnSmallHeart, interval);
        };

        spawnSmallHeart();

        setTimeout(() => {
          intro.style.display = 'none';

          const main = document.getElementById('mainContent');
          main.style.display = 'flex';
          main.style.opacity = '0';

          let op = 0;
          const fade = setInterval(() => {
            op += 0.05;
            main.style.opacity = op;
            if (op >= 1) clearInterval(fade);
          }, 20);
        }, 2500);
      }, 500);
    }
  });

  document.querySelector('.third-heart').addEventListener('click', (e) => {
    e.preventDefault();

    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('intro').style.display = 'none';

    const heartEffectPage = document.getElementById('heartEffectPage');
    heartEffectPage.style.display = 'block';

    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let hearts = [];
    const colors = ['#ff3e96', '#ff69b4', '#ff1493', '#db7093'];

    function drawHeart(x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0, -3, -5, -5, -5, -10);
      ctx.bezierCurveTo(-5, -15, 0, -18, 0, -12);
      ctx.bezierCurveTo(0, -18, 5, -15, 5, -10);
      ctx.bezierCurveTo(5, -5, 0, -3, 0, 0);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function createHeart() {
      const x = Math.random() * canvas.width;
      const y = canvas.height + 10;
      const size = 0.5 + Math.random() * 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const speed = 1 + Math.random() * 2;
      return { x, y, size, color, speed };
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((heart, index) => {
        drawHeart(heart.x, heart.y, heart.size, heart.color);
        heart.y -= heart.speed;
        if (heart.y < -20) hearts.splice(index, 1);
      });
      if (Math.random() < 0.3) hearts.push(createHeart());
      requestAnimationFrame(animate);
    }
    animate();

    const albumContainer = document.getElementById('albumImagesContainer');
    const albumImagesSrc = [
      'image2.jpg',
      'image3.jpg',
      'image8.jpg',
      'image7.jpg',
      'image6.jpg',
      'image5.jpg',
      'image4.jpg'
    ];
    let albumIndex = 0;

    function createAlbumImage(src, isLast) {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'album-image';
      img.style.width = '260px';
      img.style.height = '260px';
      img.style.left = `${Math.random() * 80 + 10}%`;
      img.style.bottom = `-150px`;
      const rotateDeg = (Math.random() * 40) - 20;
      img.style.transform = `rotate(${rotateDeg}deg) translateY(0)`;
      albumContainer.appendChild(img);

      let start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const duration = 6000;
        const progress = Math.min(elapsed / duration, 1);
        const translateY = -window.innerHeight - 180;
        img.style.transform = `rotate(${rotateDeg}deg) translateY(${progress * translateY}px)`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          albumContainer.removeChild(img);
          if (isLast) {
            heartEffectPage.style.display = 'none';
            const main = document.getElementById('mainContent');
            main.style.display = 'flex';
            main.style.opacity = '0';

            let op = 0;
            const fade = setInterval(() => {
              op += 0.05;
              main.style.opacity = op;
              if (op >= 1) clearInterval(fade);
            }, 20);
          }
        }
      }
      requestAnimationFrame(step);
    }

    function spawnAlbumImages() {
      if (albumIndex >= albumImagesSrc.length) return;
      const isLast = albumIndex === albumImagesSrc.length - 1;
      createAlbumImage(albumImagesSrc[albumIndex], isLast);
      albumIndex++;
      setTimeout(spawnAlbumImages, 1000);
    }

    spawnAlbumImages();
  });

  const audio = document.getElementById('bgMusic');
  if (audio) {
    audio.volume = 0.9;

    const playAudio = () => {
      audio.play().catch((err) => {
        console.warn('Không thể phát audio:', err);
      });
      window.removeEventListener('click', playAudio);
      window.removeEventListener('keydown', playAudio);
    };

    window.addEventListener('click', playAudio);
    window.addEventListener('keydown', playAudio);
  }
});
