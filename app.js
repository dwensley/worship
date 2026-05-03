// Hymnal App JavaScript
class HymnalApp {
    constructor() {
        this.songs = this.loadSongs();
        this.currentSong = null;
        this.editingIndex = -1;
        this.initializeApp();
    }

    // Load songs from localStorage or use default songs
    loadSongs() {
        const saved = localStorage.getItem('hymnal-songs');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default songs
        return [
            {
                title: "Be Thou My Vision",
                lyrics: `1.
Be Thou my vision, O Lord of my heart;
Naught be all else to me, save that Thou art—
Thou my best thought, by day or by night,
Waking or sleeping, Thy presence my light.

2.
Be Thou my wisdom, and Thou my true Word;
I ever with Thee and Thou with me, Lord;
Thou my great Father, and I Thy true son;
Thou in me dwelling, and I with Thee one.

3.
Riches I heed not, nor man's empty praise,
Thou mine inheritance, now and always:
Thou and Thou only, first in my heart,
High King of heaven, my treasure Thou art.

4.
High King of heaven, my victory won,
May I reach heaven's joys, O bright heaven's Sun!
Heart of my own heart, whatever befall,
Still be my vision, O Ruler of all.`
            },
            {
                title: "Amazing Grace",
                lyrics: `1.
Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

2.
'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

3.
Through many dangers, toils and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.

4.
When we've been there ten thousand years,
Bright shining as the sun,
We've no less days to sing God's praise
Than when we'd first begun.`
            }
        ];
    }

    // Save songs to localStorage
    saveSongs() {
        localStorage.setItem('hymnal-songs', JSON.stringify(this.songs));
    }

    // Initialize the app
    initializeApp() {
        this.bindEvents();
        this.showTocView();
    }

    // Bind all event listeners
    bindEvents() {
        document.getElementById('add-song-btn').addEventListener('click', () => this.showAddForm());
        document.getElementById('back-to-toc').addEventListener('click', () => this.showTocView());
        document.getElementById('edit-song-btn').addEventListener('click', () => this.editCurrentSong());
        document.getElementById('cancel-form').addEventListener('click', () => this.showTocView());
        document.getElementById('song-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Show table of contents view
    showTocView() {
        this.hideAllViews();
        document.getElementById('toc-view').classList.add('active');
        this.renderSongList();
    }

    // Show song view
    showSongView(songIndex) {
        this.hideAllViews();
        document.getElementById('song-view').classList.add('active');
        this.currentSong = songIndex;
        this.renderSong(this.songs[songIndex]);
    }

    // Show add/edit form
    showAddForm() {
        this.hideAllViews();
        document.getElementById('form-view').classList.add('active');
        document.getElementById('form-title').textContent = 'Add New Song';
        document.getElementById('song-form').reset();
        this.editingIndex = -1;
    }

    // Show edit form for current song
    editCurrentSong() {
        if (this.currentSong === null) return;
        
        this.hideAllViews();
        document.getElementById('form-view').classList.add('active');
        document.getElementById('form-title').textContent = 'Edit Song';
        
        const song = this.songs[this.currentSong];
        document.getElementById('song-title').value = song.title;
        document.getElementById('song-lyrics').value = song.lyrics;
        this.editingIndex = this.currentSong;
    }

    // Hide all views
    hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
    }

    // Render the song list
    renderSongList() {
        const songList = document.getElementById('song-list');
        
        if (this.songs.length === 0) {
            songList.innerHTML = `
                <div class="empty-state">
                    <h3>No songs yet</h3>
                    <p>Click "Add Song" to get started!</p>
                </div>
            `;
            return;
        }

        songList.innerHTML = this.songs.map((song, index) => {
            const preview = song.lyrics.split('\n').slice(0, 2).join(' ').substring(0, 100) + '...';
            return `
                <div class="song-item" onclick="app.showSongView(${index})">
                    <h3>${this.escapeHtml(song.title)}</h3>
                    <div class="song-preview">${this.escapeHtml(preview)}</div>
                </div>
            `;
        }).join('');
    }

    // Render individual song
    renderSong(song) {
        const songContent = document.getElementById('song-content');
        
        const formattedLyrics = this.formatLyrics(song.lyrics);
        
        songContent.innerHTML = `
            <h1 class="song-title" onclick="app.showTocView()">${this.escapeHtml(song.title)}</h1>
            ${formattedLyrics}
        `;
    }

    // Format lyrics with verse numbers and chorus styling
    formatLyrics(lyrics) {
        const lines = lyrics.split('\n');
        let formatted = '';
        let inChorus = false;
        let currentVerse = '';

        for (let line of lines) {
            line = line.trim();
            
            if (line === '') {
                if (currentVerse) {
                    if (inChorus) {
                        formatted += `</div>`;
                        inChorus = false;
                    } else {
                        formatted += `</div>`;
                    }
                    currentVerse = '';
                }
                continue;
            }

            if (line.toLowerCase().startsWith('chorus:')) {
                if (currentVerse) {
                    formatted += `</div>`;
                    currentVerse = '';
                }
                formatted += `<div class="chorus"><div class="chorus-label">${this.escapeHtml(line)}</div>`;
                inChorus = true;
                continue;
            }

            if (line.match(/^\d+\./)) {
                if (currentVerse) {
                    formatted += `</div>`;
                }
                formatted += `<div class="verse"><div class="verse-number">${this.escapeHtml(line)}</div>`;
                currentVerse = 'verse';
                inChorus = false;
                continue;
            }

            if (!currentVerse) {
                if (inChorus) {
                    // Continue chorus
                } else {
                    formatted += `<div class="verse">`;
                    currentVerse = 'verse';
                }
            }

            formatted += `${this.escapeHtml(line)}<br>`;
        }

        if (currentVerse) {
            formatted += `</div>`;
        }

        return formatted;
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('song-title').value.trim();
        const lyrics = document.getElementById('song-lyrics').value.trim();

        if (!title || !lyrics) {
            alert('Please fill in both title and lyrics');
            return;
        }

        const song = { title, lyrics };

        if (this.editingIndex >= 0) {
            // Edit existing song
            this.songs[this.editingIndex] = song;
        } else {
            // Add new song
            this.songs.push(song);
        }

        this.saveSongs();
        this.showTocView();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HymnalApp();
});