document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display the first movie
    fetchMovieDetails(1);

    // Fetch and display the list of movies
    fetchMovies();
});

// Function to fetch details of a specific movie
function fetchMovieDetails(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => displayMovieDetails(movie))
        .catch(error => console.error("Error fetching movie details:", error));
}

// Function to display movie details in the UI
function displayMovieDetails(movie) {
    const poster = document.getElementById("poster");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const showtime = document.getElementById("showtime");
    const availableTickets = document.getElementById("available-tickets");
    const buyButton = document.getElementById("buy-ticket");

    // Populate movie details
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `${movie.runtime} minutes`;
    showtime.textContent = movie.showtime;
    availableTickets.textContent = movie.capacity - movie.tickets_sold;

    // Update button state
    if (movie.capacity - movie.tickets_sold <= 0) {
        buyButton.textContent = "Sold Out";
        buyButton.disabled = true;
    } else {
        buyButton.textContent = "Buy Ticket";
        buyButton.disabled = false;
    }

    // Add event listener for buying tickets
    buyButton.onclick = () => buyTicket(movie);
}

// Function to fetch and display the list of movies
function fetchMovies() {
    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(films => renderFilmList(films))
        .catch(error => console.error("Error fetching films:", error));
}

// Function to render the movie list
function renderFilmList(films) {
    const filmList = document.getElementById("films");
    filmList.innerHTML = ""; // Clear existing list

    films.forEach(film => {
        const li = document.createElement("li");
        li.classList.add("film", "item");
        li.textContent = film.title;

        // Click event to load movie details
        li.addEventListener("click", () => fetchMovieDetails(film.id));

        // Create Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        // Add Event Listener to Delete Film
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent movie details from loading
            deleteFilm(film.id, li);
        });

        // Append Delete Button to List Item
        li.appendChild(deleteBtn);
        filmList.appendChild(li);
    });
}

// Function to handle buying a ticket
function buyTicket(movie) {
    if (movie.capacity - movie.tickets_sold > 0) {
        const newTicketsSold = movie.tickets_sold + 1;

        // Update the backend with the new tickets sold count
        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets_sold: newTicketsSold })
        })
        .then(response => response.json())
        .then(updatedMovie => displayMovieDetails(updatedMovie))
        .catch(error => console.error("Error updating tickets:", error));
    }
}

// Function to delete a film from the server and UI
function deleteFilm(filmId, listItem) {
    fetch(`http://localhost:3000/films/${filmId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete film");
        }
        // Remove the film from the UI
        listItem.remove();
        console.log(`Film ${filmId} deleted successfully`);
    })
    .catch(error => console.error("Error:", error));
}

