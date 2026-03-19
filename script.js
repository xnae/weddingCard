/**
 * Classic Elegant Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 두 자리로 변환
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? 'AM' : 'PM';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}` : '';
    return `${year}/${month}/${date}(${day}) ${period} ${h12} :${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 30) {
    return new Promise(resolve => {
        const promises = [];

        // 1번부터 maxAttempts까지 병렬로 확인을 시작합니다.
        for (let i = 1; i <= maxAttempts; i++) {
            const path = `images/${folder}/${i}.jpg`;
            const p = new Promise(res => {
                const img = new Image();
                img.onload = () => res({ id: i, url: path });
                img.onerror = () => res(null);
                img.src = path;
            });
            promises.push(p);
        }

        Promise.all(promises).then(results => {
            // 성공한 이미지들만 추출하고 순서대로 정렬합니다.
            const validImages = results
                .filter(res => res !== null)
                .sort((a, b) => a.id - b.id)
                .map(res => res.url);
            resolve(validImages);
        });
    });
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

 function setMetaTags() {
  const m = CONFIG.meta;
  document.title = m.title;
  
  const setMeta = (attr, val, content) => {
    const el = document.querySelector(`meta[${attr}="${val}"]`);
    if (el) el.setAttribute('content', content);
  };
   
  const fullImgUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'images/og/1.jpg';

  setMeta('property', 'og:title', m.title);
  setMeta('property', 'og:description', m.description);
  setMeta('property', 'og:image', fullImgUrl); // 절대 주소 사용
  setMeta('name', 'description', m.description);
  
  console.log("설정된 썸네일 주소:", fullImgUrl); // 확인용
}

  /* ═══════════════════════════════════════════
     Curtain
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    const btn = $('#curtainBtn');
    const namesEl = $('#curtainNames');

    // If useCurtain is false, skip the curtain entirely
    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      initPetals();
      return;
    }

    namesEl.textContent = `${CONFIG.groom.name}  &  ${CONFIG.bride.name}`;

    btn.addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        curtain.classList.add('is-hidden');
        initPetals();
      }, 1400);
    });

    document.body.classList.add('no-scroll');
  }

  /* ═══════════════════════════════════════════
     Falling Petals
     ═══════════════════════════════════════════ */

  function initPetals() {
    const canvas = $('#petalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const petals = [];
    const PETAL_COUNT = 25;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * -1 : -20;
        this.size = 8 + Math.random() * 10;
        this.speedY = 0.5 + Math.random() * 1;
        this.speedX = -0.3 + Math.random() * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.oscillateAmp = 20 + Math.random() * 30;
        this.oscillateSpeed = 0.01 + Math.random() * 0.02;
        this.oscillateOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.2 + Math.random() * 0.4;
        this.t = 0;
      }

      update() {
        this.t++;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.t * this.oscillateSpeed + this.oscillateOffset) * 0.5;
        this.rotation += this.rotSpeed;
        if (this.y > height + 20) this.reset();
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#e8c8b0';
        ctx.beginPath();
        // Petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          this.size * 0.3, -this.size * 0.4,
          this.size * 0.7, -this.size * 0.5,
          this.size, 0
        );
        ctx.bezierCurveTo(
          this.size * 0.7, this.size * 0.3,
          this.size * 0.3, this.size * 0.3,
          0, 0
        );
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    $('#heroPhoto').src = 'images/hero/1.jpg';
    $('#heroNames').textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    $('#heroDate').textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);
    $('#heroVenue').textContent = `${CONFIG.wedding.venue} ${CONFIG.wedding.hall}`;
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;

      const labelEl = $('#countdownLabel');

      if (diff <= 0) {
        $('#countDays').textContent = '0';
        $('#countHours').textContent = '0';
        $('#countMinutes').textContent = '0';
        $('#countSeconds').textContent = '0';
        labelEl.textContent = '결혼식이 시작되었습니다';
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $('#countDays').textContent = days;
      $('#countHours').textContent = String(hours).padStart(2, '0');
      $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    const parentsHTML = `
      <div class="parent-row">
        ${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}
        의 장남 <span class="child-name">${g.name}</span>
      </div>
      <div class="parent-row">
        ${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}
        의 장녀 <span class="child-name">${b.name}</span>
      </div>
    `;

    $('#greetingParents').innerHTML = parentsHTML;
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    const w = CONFIG.wedding;
    const formattedDate = w.date.replace(/-/g, '/'); // 2026/09/19 형식
    const day = ['일', '월', '화', '수', '목', '금', '토'][dt.getDay()];
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const period = hours < 12 ? 'AM' : 'PM';
    const h12 = hours % 12 || 12;
    const timeStr = `${period} ${h12} :${minutes > 0 ? ` ${minutes}` : ''}`;

    $('#calendarInfoDate').textContent = `${formattedDate}(${day}) ${timeStr}`;
    $('#calendarInfoVenue').textContent = w.venue;
    $('#calendarInfoHall').textContent = w.hall;

    const grid = $('#calendarGrid');

    // Header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    grid.innerHTML = `<div class="calendar__header">${monthNames[month]} ${year}</div>`;

    // Weekdays
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';
    weekdays.forEach(wd => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday';
      el.textContent = wd;
      wdRow.appendChild(el);
    });
    grid.appendChild(wdRow);

    // Days
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');
      dayEl.className = 'calendar__day';
      if (d === weddingDay) dayEl.classList.add('is-today');
      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);

    // Google Calendar link
    const startDate = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const endDate = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.groom.name + ' ♥ ' + CONFIG.bride.name + ' 결혼식')}&dates=${startDate}/${endDate}&location=${encodeURIComponent(CONFIG.wedding.venue + ' ' + CONFIG.wedding.address)}&details=${encodeURIComponent('결혼식에 초대합니다.')}`;
    $('#googleCalBtn').href = gcalUrl;

    // ICS download
    $('#icsDownloadBtn').addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding//Invitation//KO',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`,
        `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
        'DESCRIPTION:결혼식에 초대합니다.',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding.ics';
      a.click();
      URL.revokeObjectURL(url);
      showToast('캘린더 파일이 다운로드됩니다');
    });
  }

  /* ═══════════════════════════════════════════
     Story Section
     ═══════════════════════════════════════════ */

  function initStory(storyImages) {
    $('#storyTitle').textContent = CONFIG.story.title;
    $('#storyContent').textContent = CONFIG.story.content;

    const container = $('#storyPhotos');
    // Remove loading placeholder if present
    const placeholder = container.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();

    if (storyImages.length === 0) return;

    storyImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'story__photo-item animate-item';
      div.setAttribute('data-animate', 'fade-up');
      div.innerHTML = `<img src="${src}" alt="스토리 사진 ${i + 1}" loading="lazy">`;
      div.addEventListener('click', () => openPhotoModal(storyImages, i));
      container.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

  function initGallery(galleryImages) {
    const grid = $('#galleryGrid');
    // Remove loading placeholder if present
    const placeholder = grid.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();

    if (galleryImages.length === 0) {
      // Hide gallery section if no images found
      const gallerySection = $('#gallery');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    galleryImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'gallery__item animate-item';
      div.setAttribute('data-animate', 'scale-in');
      div.innerHTML = `<img src="${src}" alt="갤러리 사진 ${i + 1}" loading="lazy">`;
      div.addEventListener('click', () => openPhotoModal(galleryImages, i));
      grid.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Photo Modal (with swipe)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    showModalImage();
    $('#photoModal').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function showModalImage() {
    const img = $('#modalImg');
    img.src = modalImages[modalIndex];
    $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;

    $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
    $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    $('#modalClose').addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));

    const modal = $('#photoModal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') {
        closePhotoModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowLeft') modalNavigate(-1);
      if (e.key === 'ArrowRight') modalNavigate(1);
    });

    // Swipe support
    const container = $('#modalContainer');

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;

    if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX > 0) {
      modalNavigate(1); // swipe left -> next
    } else {
      modalNavigate(-1); // swipe right -> prev
    }
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;

    const addressEl = $('#locationAddress');
    if (addressEl) addressEl.textContent = w.address;

    // Kakao Maps 가이드 스타일의 초기화
    const container = document.getElementById('kakaoMap');
    if (container && typeof kakao !== 'undefined') {
        const defaultCoords = new kakao.maps.LatLng(w.lat, w.lng);
        const options = {
          center: defaultCoords,
          level: 3
        };
        const map = new kakao.maps.Map(container, options);
        
        // 마커를 미리 생성합니다 (검색 실패 시에도 기본 좌표에 표시)
        const marker = new kakao.maps.Marker({
            position: defaultCoords,
            map: map
        });

        // 이름표(커스텀 오버레이) 생성
        const content = `<div style="padding:5px 10px; background:#fff; border:1px solid #ccc; border-radius:15px; font-size:12px; font-weight:bold; color:#333; box-shadow: 0 2px 5px rgba(0,0,0,0.1); white-space: nowrap;">${w.venue}</div>`;
        const customOverlay = new kakao.maps.CustomOverlay({
            position: defaultCoords,
            content: content,
            yAnchor: 2.6
        });
        customOverlay.setMap(map);

        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(w.address, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 검색된 위치로 마커와 이름표 이동
                marker.setPosition(coords);
                customOverlay.setPosition(coords);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);

                // 지도가 가끔 깨지는 현상 방지용 정렬 코드
                setTimeout(() => {
                  map.relayout();
                  map.setCenter(coords);
                }, 500);
            } else {
                console.warn('주소 검색에 실패하여 기본 좌표를 사용합니다: ' + status);
            }
        });

        // 지도 타입 컨트롤(지도/스카이뷰)과 줌 컨트롤 추가
        map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
    }

    $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';

    // Transport info
    if (w.transport) {
      $('#subwayInfo').textContent = w.transport.subway;
      $('#busInfo').textContent = w.transport.bus;
      $('#carInfo').textContent = w.transport.car;
    }

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    accounts.forEach((acc) => {
      const item = document.createElement('div');
      item.className = 'account-item';
      item.innerHTML = `
        <div class="account-item__info">
          <div class="account-item__role">${acc.role}</div>
          <div class="account-item__detail">
            <span class="account-item__name">${acc.name || ''}</span>
            ${acc.bank} ${acc.number}
          </div>
        </div>
        <button class="account-item__copy" data-account="${acc.bank} ${acc.number} ${acc.name || ''}">
          복사
        </button>
      `;
      container.appendChild(item);
    });
  }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    initAccordion('groomAccordion', 'groomAccordionPanel');
    initAccordion('brideAccordion', 'brideAccordionPanel');

    // Copy account delegates
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item__copy');
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const storyPhotos = $('#storyPhotos');
    const galleryGrid = $('#galleryGrid');

    const placeholderHTML = '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';

    if (storyPhotos) storyPhotos.innerHTML = placeholderHTML;
    if (galleryGrid) galleryGrid.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // 한번 나타나면 계속 유지하고 싶다면 unobserve를 그대로 둡니다.
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // threshold: 0.1, // 10%만 보여도 작동 (기존 0.15에서 하향)
        threshold: 0, // 단순화

        rootMargin: '0px 0px -50px 0px' // 화면 하단보다 조금 일찍 시작
      }
    );

    // Observe initial static items
    $$('.animate-item').forEach((el) => observer.observe(el));

    //Re-observe after dynamic content is added (MutationObserver)
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('animate-item')) {
            observer.observe(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('.animate-item').forEach((el) => observer.observe(el));
          }
        });
      });
    });
    
     mutObs.observe(document.body, { childList: true, subtree: true });
    
     // 동적 콘텐츠 추가 시 수동 호출할 수 있도록 헬퍼 제공
    // window.observeNewItems = function(container) {
    //   container.querySelectorAll('.animate-item').forEach((el) => observer.observe(el));
    // };
  }

  /* ═══════════════════════════════════════════
   BGM Control
   ═══════════════════════════════════════════ */
function initBgm() {
  const bgm = document.getElementById('bgm');
  const bgmBtn = document.getElementById('bgmBtn');
  if (!bgm || !bgmBtn) return;

  const playIcon = bgmBtn.querySelector('.icon-play');
  const pauseIcon = bgmBtn.querySelector('.icon-pause');

  bgmBtn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play();
      bgmBtn.classList.add('playing');
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      bgm.pause();
      bgmBtn.classList.remove('playing');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  });
}

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initCurtain();
    initHero();
    initBgm(); // BGM 초기화 추가
    initCountdown();
    initGreeting();
    initCalendar();

    // Show loading placeholders while detecting images
    showLoadingPlaceholders();

    // Init sections that don't depend on image detection
    initPhotoModal();
    initLocation();
    initAccounts();
    initFooter();
    initScrollAnimations();

    // Auto-detect gallery images
    const galleryImages = await loadImagesFromFolder('gallery');

    // Render gallery section
    initGallery(galleryImages);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('visibilitychange', () => {
    const bgm = document.getElementById('bgm');
    const bgmBtn = document.getElementById('bgmBtn');
    if (!bgm || !bgmBtn) return;

    const playIcon = bgmBtn.querySelector('.icon-play');
    const pauseIcon = bgmBtn.querySelector('.icon-pause');

    if (document.hidden) {
      if (!bgm.paused) {
        bgm.pause();
        bgmBtn.classList.remove('playing');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }
  });
})();
