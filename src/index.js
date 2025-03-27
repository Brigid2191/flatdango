
// I have assigned my baseUrl const my link as a value
const baseUrl = 'http://localhost:3000';


document.addEventListener('DOMContentLoaded', function () {
    
 // This is a fetch request function from the baseUrl link in films
  async function fetchMovies() {
      const response = await fetch(`${baseUrl}/films`);
      const data = await response.json();
      return data;

  }

  // This is a function that uses an ID to fetch the fetchMovieById function
  async function fetchMovieById(id) {
      const response = await fetch(`${baseUrl}/films/${id}`);
      const data = await response.json();
      return data;
  }

  // This is a function that does updates on what is ticket is sold
  async function updateTicketsSold(id, ticketsSold) {
      await fetch(`${baseUrl}/films/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: ticketsSold }),
      });
  }

  // This is a function that takes movies as a parameter and passess its deta
  async function renderMovieDetails(movie) {
      const poster = document.getElementById('poster');
      const title = document.getElementById('title');
      const runtime = document.getElementById('runtime');
      const filmInfo = document.getElementById('film-info');
      const showtime = document.getElementById('showtime');
      const ticketNum = document.getElementById('ticket-num');
      const buyTicketBtn = document.getElementById('buy-ticket');

      poster.src = movie.poster;
      title.textContent = movie.title;
      runtime.textContent = `${movie.runtime} minutes`;
      filmInfo.textContent = movie.description;
      showtime.textContent = movie.showtime;

      const remainingTickets = movie.capacity - movie.tickets_sold;
      ticketNum.textContent = `${remainingTickets} remaining tickets`;

      if (remainingTickets <= 0) {
          buyTicketBtn.disabled = true;
          buyTicketBtn.textContent = 'Sold Out';
      } else {
          buyTicketBtn.disabled = false;
          buyTicketBtn.textContent = 'Buy Ticket';
      }

      buyTicketBtn.onclick = async () => {
          if (remainingTickets <= 0) {
              alert('This showing is sold out.');
              return;
          }

          const newTicketsSold = movie.tickets_sold + 1;
          await updateTicketsSold(movie.id, newTicketsSold);
          const updatedRemainingTickets = movie.capacity - newTicketsSold;
          ticketNum.textContent = `${updatedRemainingTickets} remaining tickets`;

          if (updatedRemainingTickets <= 0) {
              buyTicketBtn.disabled = true;
              buyTicketBtn.textContent = 'Sold Out';
          }
      };
  }

  async function renderMoviesMenu() {
      const movies = await fetchMovies();
      const filmsList = document.getElementById('films');

      filmsList.innerHTML = '';
      movies.forEach((movie) => {
          const li = document.createElement('li');
          li.classList.add('film', 'item');
          li.textContent = movie.title;
          li.addEventListener('click', async () => {
              const movieDetails = await fetchMovieById(movie.id);
              renderMovieDetails(movieDetails);
          });
          filmsList.appendChild(li);
      });
  }

  //Rendering that movie  by calling it
  renderMoviesMenu();
  fetchMovieById(11).then(renderMovieDetails);
});
