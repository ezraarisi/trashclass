//options here
  autoScrolling: true,
  navigation: true,
  onLeave: (origin, destination, direction) => {
    const section = destination.item;
    const title = section.querySelector("h1");
    const tl = new TimelineMax({ delay: 0.5 });
    tl.fromTo(title, 0.5, { y: "50", opacity: 0 }, { y: "0", opacity: 1 });
    if (destination.index === 1) {
      const chairs = document.querySelectorAll(".chair");
      const description = document.querySelector(".description");
      tl.fromTo(chairs, 0.7, { x: "100%" }, { x: "-10%" })
        .fromTo(
          description,
          0.5,
          { opacity: 0, y: "50" },
          { y: "0", opacity: 1 }
        )
        .fromTo(chairs[0], 1, { opacity: 1 }, { opacity: 1 })
        .fromTo(chairs[1], 1, { opacity: 0 }, { opacity: 1 })
        .fromTo(chairs[2], 1, { opacity: 0 }, { opacity: 1 });
    }
  }

  background-image: url("./img/couch.jpg");
  background-size: cover;


  <div class="grid-2">
        <div class="section-1">
            <i class="fas fa-code fa-5x white"></i>
            <h2>FirstName LastName</h2>
            <p>City,Country.</p>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
            <a href="#"><i class="fab fa-github"></i></a>
        </div>
        <div class="section-2">
            <h2>About</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quas sint et nihil iusto eius nostrum sit error, repellat optio quisquam! Magnam dolore iusto cumque. Nostrum error iste neque maiores.</p>
            <h2>Experience</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis in maiores autem quidem.</p>

            <h2>Skills</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis in maiores autem quidem obcaecati excepturi! Cupiditate eaque itaque magni voluptatibus neque nobis est dolor? Atque sunt minus ipsa asperiores. At.</p>
            <h2>Projects</h2>
            <a href="#">Project 1</a>
            <a href="#">Project 2</a>
            <a href="#">Project 3</a>
            <a href="#">Project 4</a>
            <a href="#">Project 5</a>
            <h2>Contact</h2>
            <p>myEmail@email.com</p>
        </div>
    </div>