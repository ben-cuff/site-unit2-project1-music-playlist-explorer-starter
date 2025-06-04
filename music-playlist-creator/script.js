let playlistData = [];

function loadPlaylistsFromFile() {
	fetch("data/data.json")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			playlistData = data;
			renderPlaylists();
		})
		.catch((error) => {
			console.error("Unable to load playlists:", error);
		});
}

document.addEventListener("DOMContentLoaded", () => {
	loadPlaylistsFromFile();
});

function renderPlaylists() {
	const playlistContainer = document.getElementById("playlist-container");
	playlistData.forEach((playlist) => {
		const playlistDivElement = document.createElement("div");
		playlistDivElement.className = "playlist-card";
		playlistDivElement.id = playlist.playlistID;

		const playlistImage = document.createElement("img");
		playlistImage.src = playlist.playlist_art;
		playlistDivElement.appendChild(playlistImage);

		const playlistTitle = document.createElement("h2");
		playlistTitle.textContent = playlist.playlist_name;
		playlistDivElement.appendChild(playlistTitle);

		const playlistAuthor = document.createElement("p");
		playlistAuthor.textContent = playlist.playlist_author;
		playlistDivElement.appendChild(playlistAuthor);

		const likeButton = document.createElement("button");
		likeButton.id = `like-button-${playlist.playlistID}`;
		likeButton.textContent = `Likes: ${playlist.likes}`;
		likeButton.setAttribute("data-liked", "false");
		likeButton.addEventListener("click", (event) => {
			toggleLike(event);
		});
		playlistDivElement.appendChild(likeButton);

		playlistContainer.appendChild(playlistDivElement);
	});
}

function toggleLike(event) {
	const isLiked = event.target.getAttribute("data-liked") === "true";
	if (isLiked) {
		event.target.setAttribute("data-liked", "false");
		event.target.textContent = `Likes: ${
			parseInt(event.target.textContent.split(": ")[1]) - 1
		}`;
	} else {
		event.target.setAttribute("data-liked", "true");
		event.target.textContent = `Likes: ${
			parseInt(event.target.textContent.split(": ")[1]) + 1
		}`;
	}
}
