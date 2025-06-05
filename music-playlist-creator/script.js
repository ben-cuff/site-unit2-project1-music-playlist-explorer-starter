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

function setupSortSelect() {
	document
		.getElementById("sort-select")
		.addEventListener("change", (event) => {
			const sortBy = event.target.value;
			if (sortBy === "name") {
				// sorts alphabetically by playlist name
				playlistData.sort((a, b) =>
					a.playlist_name.localeCompare(b.playlist_name)
				);
			} else if (sortBy === "date") {
				// sorts by date added (newest first)
				playlistData.sort(
					(a, b) =>
						new Date(b.playlist_date) - new Date(a.playlist_date)
				);
			} else if (sortBy === "likes") {
				// sorts by number of likes (most liked first)
				playlistData.sort((a, b) => b.likes - a.likes);
			} else {
				// if no sort option is selected, reload the original data
				loadPlaylistsFromFile();
				return;
			}
			renderPlaylists();
		});
}

function setupSearch() {
	document.getElementById("search-btn").addEventListener("click", (event) => {
		event.preventDefault();
		const searchInput = document
			.getElementById("search-input")
			.value.trim()
			.toLowerCase();
		const filterType = document.getElementById("search-filter").value;
		if (filterType === "name") {
			playlistData = playlistData.filter((playlist) =>
				playlist.playlist_name.toLowerCase().includes(searchInput)
			);
		} else if (filterType === "author") {
			playlistData = playlistData.filter((playlist) =>
				playlist.playlist_author.toLowerCase().includes(searchInput)
			);
		}
		renderPlaylists();
	});
}

function setupClearSearch() {
	document
		.getElementById("clear-search-btn")
		.addEventListener("click", (event) => {
			event.preventDefault();
			document.getElementById("search-input").value = "";
			document.getElementById("search-filter").value = "name";
			loadPlaylistsFromFile();
		});
}

function initApp() {
	setupSortSelect();
	setupSearch();
	setupClearSearch();
	loadPlaylistsFromFile();
}

document.addEventListener("DOMContentLoaded", initApp);

function renderPlaylists() {
	const playlistContainer = document.getElementById("playlist-container");
	playlistContainer.innerHTML = "";
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
		likeButton.className = "like-button";

		const likeCountSpan = document.createElement("span");
		likeCountSpan.classList.add("like-count");
		likeCountSpan.textContent = `${playlist.likes}`;

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

		const deleteButton = document.createElement("button");
		deleteButton.className = "delete-button";
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", (event) => {
			event.stopPropagation();
			const index = playlistData.findIndex(
				(p) => p.playlistID === playlist.playlistID
			);
			if (index !== -1) {
				playlistData.splice(index, 1);
				renderPlaylists();
			}
		});

		playlistDivElement.appendChild(deleteButton);

		playlistContainer.appendChild(playlistDivElement);

		playlistDivElement.addEventListener("click", () => {
			renderModal(playlist);
		});
	});
}

function toggleLike(event, id) {
	const button = event.currentTarget;
	const likeCountSpan = button.querySelector(".like-count");
	const currentLikes = parseInt(likeCountSpan.textContent);
	const isLiked = button.getAttribute("data-liked") === "true";

	if (isLiked) {
		button.setAttribute("data-liked", "false");
		likeCountSpan.textContent = `${currentLikes - 1}`;
		document.getElementById("like-icon-" + id).src =
			"assets/img/heart-outline.svg";
	} else {
		button.setAttribute("data-liked", "true");
		likeCountSpan.textContent = `${currentLikes + 1}`;
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

	playlist.songs.forEach((song) => {
		const songCard = createSongCard(song);
		songCardWrapper.appendChild(songCard);
	});

	modalContent.appendChild(songCardWrapper);

	const shuffleButton = document.createElement("button");
	shuffleButton.classList.add("shuffle-button");
	shuffleButton.textContent = "Shuffle";
	shuffleButton.addEventListener("click", () => {
		const shuffledSongs = playlist.songs.sort(() => Math.random() - 0.5);
		songCardWrapper.innerHTML = "";
		shuffledSongs.forEach((song) => {
			const songCard = createSongCard(song);
			songCardWrapper.appendChild(songCard);
		});
	});
	modalContent.appendChild(shuffleButton);

	const editButton = document.createElement("button");
	editButton.classList.add("edit-button");
	editButton.textContent = "Edit";
	editButton.addEventListener("click", () => {
		const editForm = createEditForm(playlist);
		modalContent.appendChild(editForm);
	});
	modalContent.appendChild(editButton);

	const closeButton = document.createElement("button");
	closeButton.classList.add("close-button");
	closeButton.textContent = "X";
	closeButton.addEventListener("click", () => {
		modalContainer.innerHTML = "";
	});

	modalContent.appendChild(closeButton);

	modalDiv.appendChild(modalContent);
	modalContainer.appendChild(modalDiv);
}

function createSongCard(song) {
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
	return songCard;
}

document.getElementById("add-song-btn").addEventListener("click", () => {
	const songsContainer = document.getElementById("songs-container");
	const songInputGroup = document.createElement("div");
	songInputGroup.classList.add("song-input-group");

	const songTitleInput = document.createElement("input");
	songTitleInput.type = "text";
	songTitleInput.name = "song-title[]";
	songTitleInput.placeholder = "Song Title";
	songTitleInput.required = true;

	const songArtistInput = document.createElement("input");
	songArtistInput.type = "text";
	songArtistInput.name = "song-artist[]";
	songArtistInput.placeholder = "Artist";
	songArtistInput.required = true;

	songInputGroup.appendChild(songTitleInput);
	songInputGroup.appendChild(songArtistInput);
	songsContainer.appendChild(songInputGroup);
});

document.getElementById("playlist-form").addEventListener("submit", (event) => {
	event.preventDefault();

	const playlistName = document.getElementById("playlist-name").value.trim();
	const playlistAuthor = document
		.getElementById("playlist-author")
		.value.trim();
	const playlistImage = document
		.getElementById("playlist-image")
		.value.trim();

	const songTitleInputs = document.querySelectorAll(
		'input[name="song-title[]"]'
	);
	const songArtistInputs = document.querySelectorAll(
		'input[name="song-artist[]"]'
	);

	const songs = [];

	// adds the songs to the songs array
	songTitleInputs.forEach((input, index) => {
		const title = input.value.trim();
		const artist = songArtistInputs[index].value.trim();

		songs.push({
			title: title,
			artist: artist,
			album: "",
			duration: "",
			image: "",
		});
	});

	const newPlaylist = {
		playlistID: "playlist-" + Date.now(),
		playlist_name: playlistName,
		playlist_author: playlistAuthor,
		playlist_art: playlistImage,
		likes: 0,
		songs: songs,
	};

	playlistData.push(newPlaylist);
	renderPlaylists();

	event.target.reset();
	document.getElementById("songs-container").innerHTML = `
		<div class="song-input-group">
			<input type="text" name="song-title[]" placeholder="Song Title" required />
			<input type="text" name="song-artist[]" placeholder="Artist" required />
		</div>
	`;
});

function createEditForm(playlist) {
	const editForm = document.createElement("form");
	editForm.classList.add("edit-form");
	editForm.innerHTML = `
		<input type="text" id="edit-playlist-name" value="${playlist.playlist_name}" required>
		<input type="text" id="edit-playlist-author" value="${playlist.playlist_author}" required>
		<input type="text" id="edit-playlist-image" value="${playlist.playlist_art}">
		<button type="submit" class="edit-button">Save</button>
	`;

	const songsContainer = document.createElement("div");
	songsContainer.classList.add("edit-songs-container");

	// Create a div for each song in the playlist
	// and add inputs for title and artist
	playlist.songs.forEach((song) => {
		const songDiv = document.createElement("div");
		songDiv.classList.add("edit-song-group");

		const songTitleInput = document.createElement("input");
		songTitleInput.type = "text";
		songTitleInput.name = "edit-song-title[]";
		songTitleInput.value = song.title;
		songTitleInput.required = true;
		songDiv.appendChild(songTitleInput);

		const songArtistInput = document.createElement("input");
		songArtistInput.type = "text";
		songArtistInput.name = "edit-song-artist[]";
		songArtistInput.value = song.artist;
		songArtistInput.required = true;
		songDiv.appendChild(songArtistInput);

		songsContainer.appendChild(songDiv);
	});

	editForm.appendChild(songsContainer);

	editForm.addEventListener("submit", (e) => {
		e.preventDefault();
		playlist.playlist_name =
			document.getElementById("edit-playlist-name").value;
		playlist.playlist_author = document.getElementById(
			"edit-playlist-author"
		).value;
		playlist.playlist_art = document.getElementById(
			"edit-playlist-image"
		).value;

		// get all title and artist inputs from the edit form
		const titleInputs = editForm.querySelectorAll(
			'input[name="edit-song-title[]"]'
		);

		// get all artist inputs from the edit form
		const artistInputs = editForm.querySelectorAll(
			'input[name="edit-song-artist[]"]'
		);

		// updates songs array with new values
		playlist.songs = [];
		titleInputs.forEach((input, index) => {
			const title = input.value.trim();
			const artist = artistInputs[index].value.trim();
			playlist.songs.push({
				title: title,
				artist: artist,
				album: "",
				duration: "",
				image: "",
			});
		});

		// re-renders the playlists and modal
		renderPlaylists();
	});

	editForm.addEventListener("submit", (e) => {
		e.preventDefault();
		playlist.playlist_name =
			document.getElementById("edit-playlist-name").value;
		playlist.playlist_author = document.getElementById(
			"edit-playlist-author"
		).value;
		playlist.playlist_art = document.getElementById(
			"edit-playlist-image"
		).value;

		const titleInputs = editForm.querySelectorAll(
			'input[name="edit-song-title[]"]'
		);
		const artistInputs = editForm.querySelectorAll(
			'input[name="edit-song-artist[]"]'
		);

		playlist.songs = [];
		titleInputs.forEach((input, index) => {
			const title = input.value;
			const artist = artistInputs[index].value;
			playlist.songs.push({
				title: title,
				artist: artist,
				album: "",
				duration: "",
				image: "",
			});
		});

		renderPlaylists();
		renderModal(playlist);
	});
	return editForm;
}
