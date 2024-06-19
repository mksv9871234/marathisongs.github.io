 
    let currentAudio = null;
    let currentPlayBtn = null;
    // Function to fetch and display songs
 async function loadSongs() {
    try {
        // Fetch the JSON data
        const response = await fetch('songs.json');
        const songs = await response.json();

        // Get the container element
        const topSongs = document.getElementById('topSongs');

        // Clear existing content
        topSongs.innerHTML = '';

        // Loop through the songs and create HTML elements
        songs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.className = 'song';
            songDiv.id = 'song'

            const img = document.createElement('img');
            img.className = 'songimg';
            img.src = song.imgSrc;
            img.id = 'songimg'
            songDiv.appendChild(img);

            const textCenterDiv = document.createElement('div');
            textCenterDiv.className = 'text-center';

            const nameSpan = document.createElement('span');
            nameSpan.style.fontSize = 'large';
            nameSpan.id = 'name';
            nameSpan.style.fontWeight = 'bold'
            nameSpan.innerHTML = `<b>${song.name}</b>`;
            textCenterDiv.appendChild(nameSpan);

            textCenterDiv.appendChild(document.createElement('br'));

            const singerSpan = document.createElement('span');
            singerSpan.id = 'singer';
            singerSpan.textContent = song.singer;
            textCenterDiv.appendChild(singerSpan);

            songDiv.appendChild(textCenterDiv);
            
             // Create audio element
             const audio = document.createElement('audio');
             audio.src = song.downloadLink;
             audio.id = `audio-${song.name}`;
             songDiv.appendChild(audio);

             // Create play/pause button
             const playBtn = document.createElement('button');
             playBtn.className = 'button';
             playBtn.innerHTML = '<img src="icon/play.png" alt="Play" />';
             playBtn.addEventListener('click', () => {
                if (audio.paused) {
                    // Pause the current audio if there is one
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentPlayBtn.innerHTML = '<img src="icon/play.png" alt="Play" />';
                    }
                    // Play the new audio and set it as current
                    audio.play();
                    playBtn.innerHTML = '<img src="icon/pause.png" alt="Pause" />';
                    currentAudio = audio;
                    currentPlayBtn = playBtn;
                } else {
                    audio.pause();
                    playBtn.innerHTML = '<img src="icon/play.png" alt="Play" />';
                    currentAudio = null;
                    currentPlayBtn = null;
                }
            });
             songDiv.appendChild(playBtn);

             const downloadLink = document.createElement('a');
             downloadLink.href = song.downloadLink;
             downloadLink.download = song.name;
             downloadLink.innerHTML = '<img src="icon/downloading.png" alt="Download"/>';
             songDiv.appendChild(downloadLink);
             
            topSongs.appendChild(songDiv);

    // search songs
        const resultsContainer = document.getElementById('search-results');
            fetch('songs.json')
            .then(response => response.json())
            .then(data => {
                // Function to perform search
                function searchsongs(query) {
                    if (query === '') {
                        return [];
                    } else {
                        const results = data.filter(song =>
                            song.name.toLowerCase().includes(query.toLowerCase())
                        );
                        return results.slice(0, 15);
                    }
                }
                // Function to display search results
                function displayResults(results) {
                    resultsContainer.innerHTML = '';
                    results.forEach(song => {
                        const listItem = document.createElement('li');
                        listItem.style.listStyle = 'none'
                        listItem.innerHTML = `<img src="${song.imgSrc}" alt="${song.name}">
                                 <span>${song.name}</span>`;
                        listItem.style.cursor = 'pointer';
                        listItem.style.margin = '10px 15px'
                        resultsContainer.appendChild(listItem);
                        listItem.addEventListener('click', function () {
                            const songId = song.id; // Assuming each song object has an 'id' property
                            const resultssong = encodeURIComponent(JSON.stringify(songId));
                            window.location.href = `AllsongDetalsPage.html?Searchedsong=${resultssong}`;
                        });
    
                    });
                }
    
                // Event listener for input changes
                document.getElementById('searchsongs').addEventListener('input', function () {
                    const query = this.value;
                    const searchResults = searchsongs(query);
                    displayResults(searchResults);
                });

                document.body.addEventListener('click', function (event) {
                    if (!resultsContainer.contains(event.target) && event.target !== document.getElementById('searchsongs')) {
                        resultsContainer.innerHTML = '';
                        resultsContainer.style.display = 'none';
                    }
                });
            })
            .catch(error => console.log('Error fetching for Search Allsongs JSON file:', error))
        });
    } catch (error) {
        console.error('Error fetching the songs:', error);
    }
    
}

// Load songs when the page loads
window.onload = loadSongs;