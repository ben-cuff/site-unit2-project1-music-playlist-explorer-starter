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
		playlistImage.src = playlist.playlist_art || "assets/img/playlist.png";
		playlistDivElement.appendChild(playlistImage);

		const playlistTitle = document.createElement("h2");
		playlistTitle.textContent = playlist.playlist_name;
		playlistDivElement.appendChild(playlistTitle);

		const playlistAuthor = document.createElement("p");
		playlistAuthor.textContent = playlist.playlist_author;
		playlistDivElement.appendChild(playlistAuthor);

		const likeButton = document.createElement("button");
		likeButton.id = `like-button-${playlist.playlistID}`;
		likeButton.dataset.liked = "false";

		const likeCountSpan = document.createElement("span");
		likeCountSpan.classList.add("like-count");
		likeCountSpan.textContent = `Likes: ${playlist.likes}`;

		likeButton.appendChild(likeCountSpan);
		likeButton.addEventListener("click", (event) => {
			event.stopPropagation();
			toggleLike(event, playlist.playlistID);
		});

		const likeIcon = document.createElement("img");
		likeIcon.src = "assets/img/heart-outline.svg";
		likeIcon.className = "like-icon";
		likeIcon.id = "like-icon-" + playlist.playlistID;
		likeButton.appendChild(likeIcon);

		playlistDivElement.appendChild(likeButton);

		playlistContainer.appendChild(playlistDivElement);

		playlistDivElement.addEventListener("click", () => {
			renderModal(playlist);
		});
	});
}

function toggleLike(event, id) {
	const button = event.currentTarget;
	const likeCountSpan = button.querySelector(".like-count");
	const currentLikes = parseInt(likeCountSpan.textContent.split(": ")[1]);
	const isLiked = button.getAttribute("data-liked") === "true";
	if (isLiked) {
		button.setAttribute("data-liked", "false");
		likeCountSpan.textContent = `Likes: ${currentLikes - 1}`;
		document.getElementById("like-icon-" + id).src =
			"assets/img/heart-outline.svg";
	} else {
		button.setAttribute("data-liked", "true");
		likeCountSpan.textContent = `Likes: ${currentLikes + 1}`;
		document.getElementById("like-icon-" + id).src = "assets/img/heart.svg";
	}
}

function renderModal(playlist) {
	const modalContainer = document.querySelector(".modal-container");
	modalContainer.innerHTML = "";
	const modalDiv = document.createElement("div");
	modalDiv.classList.add("modal");

	const modalContent = document.createElement("div");
	modalContent.classList.add("modal-content");

	const modalHeader = document.createElement("div");
	modalHeader.classList.add("modal-header");

	const headerImg = document.createElement("img");
	headerImg.src = playlist.playlist_art || "assets/img/playlist.png";
	modalHeader.appendChild(headerImg);

	const headerTextWrapper = document.createElement("div");
	headerTextWrapper.classList.add("modal-header-text-wrapper");

	const headerTitle = document.createElement("h3");
	headerTitle.textContent = playlist.playlist_name;
	headerTextWrapper.appendChild(headerTitle);

	const headerAuthor = document.createElement("p");
	headerAuthor.textContent = playlist.playlist_author;
	headerTextWrapper.appendChild(headerAuthor);

	modalHeader.appendChild(headerTextWrapper);
	modalContent.appendChild(modalHeader);

	const songCardWrapper = document.createElement("div");
	songCardWrapper.classList.add("song-card-wrapper");

	if (playlist.songs && Array.isArray(playlist.songs)) {
		playlist.songs.forEach((song) => {
			const songCard = document.createElement("div");
			songCard.classList.add("song-card");

			const songImg = document.createElement("img");
			songImg.src = song.image || "assets/img/song.png";
			songCard.appendChild(songImg);

			const songCardText = document.createElement("div");
			songCardText.classList.add("song-card-text");

			const songTitle = document.createElement("h4");
			songTitle.textContent = song.title;
			songCardText.appendChild(songTitle);

			const songArtist = document.createElement("p");
			songArtist.textContent = song.artist;
			songCardText.appendChild(songArtist);

			const songAlbum = document.createElement("p");
			songAlbum.textContent = song.album;
			songCardText.appendChild(songAlbum);

			const duration = document.createElement("p");
			duration.textContent = song.duration;
			songCardText.appendChild(duration);

			songCard.appendChild(songCardText);
			songCardWrapper.appendChild(songCard);
		});
	}

	modalContent.appendChild(songCardWrapper);
	modalDiv.appendChild(modalContent);
	modalContainer.appendChild(modalDiv);
}
