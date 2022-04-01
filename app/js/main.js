
  const mob = document.querySelector(".mobile-menu");
  const menu = document.querySelector(".menu");
  console.log(mob);

  mob.addEventListener('click', function(event){
    menu.classList.toggle('active');
    mob.classList.toggle('active');
  });

  



  
