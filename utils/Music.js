class Music {
    constructor(songUrl) {
      this.songUrl = songUrl;
    }
  
    setup() {
      const song = loadSound(this.songUrl);
  
      const analyzer = new p5.Amplitude();
  
      analyzer.setInput(song);
  
      this.song = song;
      this.analyzer = analyzer;
  
      this.started = false;
    }
  
    play() {
      if (!this.started) {
        this.song.loop();
        this.started = true;
      }
    }
  
    /**
     * @returns {number} The current volume level of the song
     */
    get level() {
      return this.analyzer.getLevel();
    }
  }