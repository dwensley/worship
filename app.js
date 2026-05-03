class HymnalApp {
    constructor() {
        this.songs = this.loadSongs();
        this.currentSong = null;
        this.editingIndex = -1;
        this.initializeApp();
    }
    
    loadSongs() {
        const saved = localStorage.getItem('hymnal-songs');
        if (saved) {
            const songs = JSON.parse(saved);
            // If we only have 2 songs, reset to full default set
            if (songs.length <= 2) {
                localStorage.removeItem('hymnal-songs');
                return this.getDefaultSongs();
            }
            return songs;
        }
        return this.getDefaultSongs();
    }
    
    getDefaultSongs() {
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
                title: "Great Is Thy Faithfulness",
                lyrics: `1.
Great is Thy faithfulness, O God my Father;
There is no shadow of turning with Thee;
Thou changest not, Thy compassions, they fail not;
As Thou hast been, Thou forever will be.

Chorus:
Great is Thy faithfulness!
Great is Thy faithfulness!
Morning by morning new mercies I see.
All I have needed Thy hand hath provided;
Great is Thy faithfulness, Lord, unto me!

2.
Summer and winter and springtime and harvest,
Sun, moon and stars in their courses above
Join with all nature in manifold witness
To Thy great faithfulness, mercy and love.

3.
Pardon for sin and a peace that endureth
Thine own dear presence to cheer and to guide;
Strength for today and bright hope for tomorrow,
Blessings all mine, with ten thousand beside!`
            },
            {
                title: "All Creatures of Our God and King",
                lyrics: `1.
All creatures of our God and King
Lift up your voice and with us sing,
Alleluia! Alleluia!
Thou burning sun with golden beam,
Thou silver moon with softer gleam!
O praise Him! O praise Him!
Alleluia! Alleluia! Alleluia!

2.
Thou rushing wind that art so strong
Ye clouds that sail in Heaven along,
O praise Him! Alleluia!
Thou rising moon, in praise rejoice,
Ye lights of evening, find a voice!
O praise Him! O praise Him!
Alleluia! Alleluia! Alleluia!

3.
Thou flowing water, pure and clear,
Make music for thy Lord to hear,
O praise Him! Alleluia!
Thou fire so masterful and bright,
That givest man both warmth and light.
O praise Him! O praise Him!
Alleluia! Alleluia! Alleluia!

4.
Let all things their Creator bless,
And worship Him in humbleness,
O praise Him! Alleluia!
Praise, praise the Father, praise the Son,
And praise the Spirit, Three in One!
O praise Him! O praise Him!
Alleluia! Alleluia! Alleluia!`
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
            },
            {
                title: "A Mighty Fortress Is Our God",
                lyrics: `1.
A mighty fortress is our God,
A bulwark never failing;
Our helper He, amid the flood
Of mortal ills prevailing:
For still our ancient foe
Doth seek to work us woe;
His craft and power are great,
And, armed with cruel hate,
On earth is not his equal.

2.
Did we in our own strength confide,
Our striving would be losing;
Were not the right Man on our side,
The Man of God's own choosing:
Dost ask who that may be?
Christ Jesus, it is He;
Lord Sabaoth, His Name,
From age to age the same,
And He must win the battle.

3.
And though this world, with devils filled,
Should threaten to undo us,
We will not fear, for God hath willed
His truth to triumph through us:
The Prince of Darkness grim,
We tremble not for him;
His rage we can endure,
For lo, his doom is sure,
One little word shall fell him.

4.
That word above all earthly powers,
No thanks to them, abideth;
The Spirit and the gifts are ours
Through Him Who with us sideth:
Let goods and kindred go,
This mortal life also;
The body they may kill:
God's truth abideth still,
His kingdom is forever.`
            },
            {
                title: "How Great Thou Art",
                lyrics: `1.
O Lord my God, When I in awesome wonder,
Consider all the worlds Thy Hands have made;
I see the stars, I hear the rolling thunder,
Thy power throughout the universe displayed.

Chorus:
Then sings my soul, My Saviour God, to Thee,
How great Thou art, How great Thou art.
Then sings my soul, My Saviour God, to Thee,
How great Thou art, How great Thou art!

2.
When through the woods, and forest glades I wander,
And hear the birds sing sweetly in the trees.
When I look down, from lofty mountain grandeur
And see the brook, and feel the gentle breeze.

3.
And when I think, that God, His Son not sparing;
Sent Him to die, I scarce can take it in;
That on the Cross, my burden gladly bearing,
He bled and died to take away my sin.

4.
When Christ shall come, with shout of acclamation,
And take me home, what joy shall fill my heart.
Then I shall bow, in humble adoration,
And then proclaim: "My God, how great Thou art!"`
            }
        ];
    }
    
    saveSongs() {
        localStorage.setItem('hymnal-songs', JSON.stringify(this.songs));
    }
    
    initializeApp() {
        this.bindEvents();
        this.showTocView();
    }
    
    bindEvents() {
        document.getElementById('add-song-btn').addEventListener('click', () => this.showAddForm());
        document.getElementById('load-default-btn').addEventListener('click', () => this.loadAllHymns());
        document.getElementById('back-to-toc').addEventListener('click', () => this.showTocView());
        document.getElementById('edit-song-btn').addEventListener('click', () => this.editCurrentSong());
        document.getElementById('cancel-form').addEventListener('click', () => this.showTocView());
        document.getElementById('song-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    loadAllHymns() {
        // Never remove existing songs - only add missing defaults
        const defaultSongs = this.getDefaultSongs();
        const existingTitles = this.songs.map(song => song.title.toLowerCase().trim());
        
        defaultSongs.forEach(defaultSong => {
            const defaultTitle = defaultSong.title.toLowerCase().trim();
            if (!existingTitles.includes(defaultTitle)) {
                console.log(`Adding missing hymn: ${defaultSong.title}`);
                this.songs.push(defaultSong);
            } else {
                console.log(`Hymn already exists: ${defaultSong.title}`);
            }
        });
        
        console.log(`Total songs after Load All: ${this.songs.length}`);
        this.saveSongs();
        this.showTocView();
    }
    
    showTocView() {
        this.hideAllViews();
        document.getElementById('toc-view').classList.add('active');
        this.renderSongList();
    }
    
    showSongView(songIndex) {
        this.hideAllViews();
        document.getElementById('song-view').classList.add('active');
        this.currentSong = songIndex;
        this.renderSong(this.songs[songIndex]);
    }
    
    showAddForm() {
        this.hideAllViews();
        document.getElementById('form-view').classList.add('active');
        document.getElementById('form-title').textContent = 'Add New Song';
        document.getElementById('song-form').reset();
        this.editingIndex = -1;
    }
    
    editCurrentSong() {
        if (this.currentSong === null) return;
        
        this.hideAllViews();
        document.getElementById('form-view').classList.add('active');
        document.getElementById('form-title').textContent = 'Edit Song';
        
        const song = this.songs[this.currentSong];
        document.getElementById('song-title').value = song.title;
        document.getElementById('song-author').value = song.author || '';
        document.getElementById('song-lyrics').value = song.lyrics;
        this.editingIndex = this.currentSong;
    }
    
    hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
    }
    
    renderSongList() {
        const songList = document.getElementById('song-list');
        
        if (this.songs.length === 0) {
            songList.innerHTML = '<div style="text-align: center; padding: 40px;"><h3>No songs yet</h3><p>Click "Add Song" to get started!</p></div>';
            return;
        }

        songList.innerHTML = this.songs.map((song, index) => {
            return `<div class="song-item" onclick="app.showSongView(${index})">
                        <h3>${index + 1}. ${this.escapeHtml(song.title)}</h3>
                    </div>`;
        }).join('');
    }
    
    renderSong(song) {
        const songContent = document.getElementById('song-content');
        const formattedLyrics = this.formatLyrics(song.lyrics);
        
        const songNumber = this.currentSong + 1;
        const authorLine = (song.author && song.author.trim()) ? `<div class="song-author">${this.escapeHtml(song.author)}</div>` : '';
        songContent.innerHTML = `<h1 class="song-title" onclick="app.showTocView()">${songNumber}. ${this.escapeHtml(song.title)}</h1>${authorLine}${formattedLyrics}`;
    }
    
    formatLyrics(lyrics) {
        const lines = lyrics.split('\n');
        let formatted = '';
        let inVerse = false;

        for (let line of lines) {
            line = line.trim();
            
            if (line === '') {
                if (inVerse) {
                    formatted += '</div>';
                    inVerse = false;
                }
                continue;
            }

            if (line.match(/^\d+\./)) {
                if (inVerse) formatted += '</div>';
                formatted += `<div class="verse"><div class="verse-number">${this.escapeHtml(line)}</div>`;
                inVerse = true;
                continue;
            }
            
            if (line.match(/^(Chorus|Refrain):/i)) {
                if (inVerse) formatted += '</div>';
                formatted += `<div class="chorus"><div class="chorus-label">${this.escapeHtml(line)}</div>`;
                inVerse = true;
                continue;
            }

            if (!inVerse) {
                formatted += '<div class="verse">';
                inVerse = true;
            }

            formatted += `${this.escapeHtml(line)}<br>`;
        }

        if (inVerse) formatted += '</div>';
        return formatted;
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('song-title').value.trim();
        const author = document.getElementById('song-author').value.trim();
        const lyrics = document.getElementById('song-lyrics').value.trim();

        if (!title || !lyrics) {
            alert('Please fill in both title and lyrics');
            return;
        }

        const song = { title, lyrics };
        if (author) {
            song.author = author;
        }

        if (this.editingIndex >= 0) {
            this.songs[this.editingIndex] = song;
        } else {
            this.songs.push(song);
        }

        this.saveSongs();
        this.showTocView();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new HymnalApp();
});