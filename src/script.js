document.addEventListener("DOMContentLoaded", () => {
    console.log("Flatdango is running!");

    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(films => {
            const filmsList = document.getElementById("films");
            films.forEach(film => {
                const li = document.createElement("li");
                li.textContent = film.title;
                li.addEventListener("click", () => showMovieDetails(film));
                filmsList.appendChild(li);
            });

            if (films.length > 0) {
                showMovieDetails(films[0]); 
            }
        });
});

function showMovieDetails(film) {
    document.getElementById("movie-title").textContent = film.title;
    document.getElementById("movie-poster").src = film.poster;
    document.getElementById("movie-description").textContent = film.description;

    const availableTickets = film.capacity - film.tickets_sold;
    const ticketButton = document.getElementById("buy-ticket");
    ticketButton.textContent = availableTickets > 0 ? `Buy Ticket (${availableTickets} left)` : "Sold Out";

    ticketButton.onclick = () => buyTicket(film);
}

function buyTicket(film) {
    if (film.tickets_sold < film.capacity) {
        film.tickets_sold++;

        fetch(`http://localhost:3000/films/${film.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold })
        })
        .then(response => response.json())
        .then(updatedFilm => {
            showMovieDetails(updatedFilm);
        });
    }
}
