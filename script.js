
let startX;
let startY;

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
};
const STATE = {
  ON: false,
};
const CORD_DURATION = 0.1;

const CORDS = document.querySelectorAll('.toggle-scene__cord');
const HIT = document.querySelector('.toggle-scene__hit-spot');
const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
const PROXY = document.createElement('div');

const ENDX = DUMMY_CORD.getAttribute('x2');
const ENDY = DUMMY_CORD.getAttribute('y2');

const RESET = () => {
  gsap.set(PROXY, {
    x: ENDX,
    y: ENDY,
  });
};

RESET();

const CORD_TL = gsap.timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON;
    gsap.set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });
    gsap.set([DUMMY, HIT], { display: 'none' });
    gsap.set(CORDS[0], { display: 'block' });
    AUDIO.CLICK.play();
  },
  onComplete: () => {
    gsap.set([DUMMY, HIT], { display: 'block' });
    gsap.set(CORDS[0], { display: 'none' });
    RESET();
  },
});

for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
    gsap.to(CORDS[0], {
      morphSVG: CORDS[i],
      duration: CORD_DURATION,
      repeat: 1,
      yoyo: true,
    })
  );
}

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x;
    startY = e.y;
  },
  onDrag: function() {
    gsap.set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: this.y,
      },
    });
  },
  onRelease: function(e) {
    const DISTX = Math.abs(e.x - startX);
    const DISTY = Math.abs(e.y - startY);
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
    gsap.to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50) {
          CORD_TL.restart();
        } else {
          RESET();
        }
      },
    });
  },
});
