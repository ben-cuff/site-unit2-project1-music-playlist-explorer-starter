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
		songCardWrapper.appendChild(createSongCard(song));
	});

	modalContent.appendChild(songCardWrapper);

	const shuffleButton = document.createElement("button");
	shuffleButton.classList.add("shuffle-button");
	shuffleButton.textContent = "Shuffle";
	shuffleButton.addEventListener("click", () => {
		const shuffledSongs = playlist.songs.sort(() => Math.random() - 0.5);
		songCardWrapper.innerHTML = "";
		shuffledSongs.forEach((song) => {
			songCardWrapper.appendChild(createSongCard(song));
		});
	});
	modalContent.appendChild(shuffleButton);

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
