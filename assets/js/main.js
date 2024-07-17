document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    } else {
      console.log(`Element ${el} not found`);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    // Check if "index" is part of the URL
    if (!window.location.pathname.includes("index")) {
      return;
    }

    let position = window.scrollY;
    let header = select("#header");
    let offset = header.offsetHeight;

    let activeSection = null;

    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;

      let rect = section.getBoundingClientRect();
      let sectionTop = rect.top + window.scrollY - offset - 50; // Added buffer of 50 pixels
      let sectionBottom = sectionTop + section.offsetHeight;

      // Adjusted to ensure last section gets activated
      if (
        position >= sectionTop &&
        (position < sectionBottom ||
          (navbarlink.hash === "#contact" &&
            position + window.innerHeight >= document.body.scrollHeight))
      ) {
        activeSection = navbarlink;
      } else {
        navbarlink.classList.remove("active");
      }
    });

    if (activeSection) {
      activeSection.classList.add("active");
    }
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with offset on page load with hash links in the URL
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Play/pause video on hover and intersection
   */
  const videos = document.querySelectorAll("video");

  videos.forEach((video) => {
    video.addEventListener("mouseenter", () => {
      video.play();
    });

    video.addEventListener("mouseleave", () => {
      video.pause();
    });

    video.addEventListener("ended", () => {
      if (video.closest(":hover")) {
        video.play();
      }
    });

    video.addEventListener("click", () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        /* Firefox */
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        /* IE/Edge */
        video.msRequestFullscreen();
      }
    });
  });

  // Create an intersection observer instance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  // Observe each video element
  videos.forEach((video) => {
    observer.observe(video);
  });

  /**
   * Intersection Observer for animations on scroll
   */
  const observerOptions = {
    threshold: 0.1,
  };

  const observerCallback = (entries, visibilityObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        visibilityObserver.unobserve(entry.target);
      }
    });
  };

  const visibilityObserver = new IntersectionObserver(
    observerCallback,
    observerOptions
  );

  const elementsToObserve = document.querySelectorAll(
    ".image-item, .section-title, .social-links, .portfolio"
  );
  elementsToObserve.forEach((element) => visibilityObserver.observe(element));
});
