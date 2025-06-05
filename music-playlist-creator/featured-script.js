let playlistData = [];

function loadPlaylistsFromFile() {
	fetch("data/data.json")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			playlistData = data;
			renderPlaylist();
		})
		.catch((error) => {
			console.error("Unable to load playlists:", error);
		});
}

document.addEventListener("DOMContentLoaded", () => {
	loadPlaylistsFromFile();
});

function renderPlaylist() {
    const playlistContainer = document.getElementById("featured-container");

    const featuredPlaylist = playlistData[Math.floor(Math.random() * playlistData.length)];

    const playlistDivElement = document.createElement("div");
    playlistDivElement.className = "playlist-card";
    playlistDivElement.id = featuredPlaylist.playlistID;

    const playlistHeaderDiv = document.createElement("div");
    playlistHeaderDiv.className = "playlist-header";

    const headerImg = document.createElement("img");
	headerImg.src = featuredPlaylist.playlist_art || "assets/img/playlist.png";
	playlistHeaderDiv.appendChild(headerImg);

	const headerTextWrapper = document.createElement("div");
	headerTextWrapper.classList.add("header-text-wrapper");

	const headerTitle = document.createElement("h3");
	headerTitle.textContent = featuredPlaylist.playlist_name;
	headerTextWrapper.appendChild(headerTitle);

	const headerAuthor = document.createElement("p");
	headerAuthor.textContent = featuredPlaylist.playlist_author;
	headerTextWrapper.appendChild(headerAuthor);

	playlistHeaderDiv.appendChild(headerTextWrapper);
	playlistDivElement.appendChild(playlistHeaderDiv);

	const songCardWrapper = document.createElement("div");
	songCardWrapper.classList.add("song-card-wrapper");

	featuredPlaylist.songs.forEach((song) => {
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

    playlistDivElement.appendChild(songCardWrapper);

    playlistContainer.appendChild(playlistDivElement);
}