'use strict';
// Add the confirmed BenKen YouTube channel and videos here when available.
window.BenKenLearning={
  "youtubeChannel": "",
  "videos": [{"title":"Episode 1 — Meet BenKen Stage Pro","description":"A first tour of the song library, lyrics, mixer and controls. 3 min 25 sec.","url":"https://www.youtube.com/watch?v=tXcDqU7Qvbg","poster":"episode-01-poster.jpg"}],
  "guides": [
    {
      "id": "import-song",
      "category": "Getting started",
      "title": "Bring in your first song",
      "summary": "Import audio and song regions, or update a song from REAPER.",
      "steps": [
        "Open Mixer settings → Audio & Files.",
        "Choose Import / Update from REAPER and select the export for your song. You can also add audio files manually.",
        "Check the track names, song key and imported section regions. When replacing an arrangement, use the update workflow for the existing song.",
        "Wait for the audio to become Ready, then play the song and check every track."
      ],
      "note": "The current workflow supports REAPER exports. Keep your source exports as well as an app backup.",
      "image": "multitrack-routing.png"
    },
    {
      "id": "build-set",
      "category": "Getting started",
      "title": "Build a setlist",
      "summary": "Give the evening a running order and keep the next song in view.",
      "steps": [
        "Open Settings → Setlists & library.",
        "Create a setlist and add songs from the library.",
        "Arrange the songs in the order you want to play them.",
        "Open the setlist in your performance view and check Next and Previous before the show."
      ],
      "note": "A setlist refers to songs in your library. Back up with audio when you want a complete copy of your show.",
      "image": "stage.png"
    },
    {
      "id": "rehearse",
      "category": "Rehearsal",
      "title": "Rehearse a section",
      "summary": "Use song regions, a count-in, tempo and selected-track transpose.",
      "steps": [
        "Open Settings → Practice to configure region playback for rehearsal.",
        "Open Tempo & metronome to choose a count-in and click settings.",
        "Choose the region you want to start from, then check the count-in and metronome output.",
        "Adjust tempo or key while stopped. In track settings, choose which tracks follow the song key."
      ],
      "note": "Up to three tracks can be selected for audio transposition. Drum and click tracks can keep their original pitch. A count-in can also be useful live.",
      "image": "tempo.png"
    },
    {
      "id": "capo-key",
      "category": "Rehearsal",
      "title": "Understand Capo & Key",
      "summary": "Keep the song key separate from the chord shapes and another player’s capo.",
      "steps": [
        "Open Capo & Key using the shortcut above the setlist button, or through Settings.",
        "Enter optional names for My capo and Bandmate capo. Leave them empty to use the standard labels.",
        "Use My capo to choose the shapes shown in your lyrics. Use Bandmate capo only as a reminder of that player’s fret position.",
        "Save your capo positions. Choose Lyrics, Chords or Both under Settings → Lyrics & scrolling."
      ],
      "note": "Example: song key Cm, My capo 0 and Bandmate capo 3 keeps Cm in the lyrics. If My capo is 3, the displayed shape becomes Am, while the song key remains Cm.",
      "image": "capo.png"
    },
    {
      "id": "prepare-live",
      "category": "Live setup",
      "title": "Prepare for a live show",
      "summary": "Check your files, outputs, controls and backup before performing.",
      "steps": [
        "Make sure every song in the selected set has its audio downloaded locally.",
        "Choose Native under Audio & playback. Use Practice / Stereo for a stereo mix, or Live / USB for separate output routing.",
        "In Mixer settings → Tracks, choose an output bus for each track. Check the bus outputs against your connected interface or mixer.",
        "Choose your button layout under Controls & fullscreen. Test Play, Stop, Next and any MIDI controls.",
        "Create a full backup with audio and prepare a second device with a downloaded copy of the concert. Test the whole set with your actual hardware."
      ],
      "note": "Concert sync copies content. It does not start two devices together or provide automatic failover. Output routing depends on the channels offered by your audio hardware.",
      "image": "multitrack-routing.png"
    },
    {
      "id": "follow-lyrics",
      "category": "Sharing",
      "title": "Host & Follow Lyrics",
      "summary": "Let bandmates follow the current song and lyric position.",
      "steps": [
        "Connect the host and follower devices to the same local network.",
        "On the host, open Settings → Share lyrics and start hosting.",
        "Share the displayed link or QR code with the follower devices.",
        "Keep the host open, select a song and check that followers see the same song and lyric position."
      ],
      "note": "Follow Lyrics shares the text display. It does not transfer backing tracks or synchronise audio playback.",
      "image": "stage.png"
    },
    {
      "id": "share-backup",
      "category": "Sharing",
      "title": "Share a set or keep a backup",
      "summary": "Choose between sharing, concert transfer and a full backup.",
      "steps": [
        "To send music to someone else, open Share songs & setlists and choose a song or set with audio. Cloud sharing needs sign-in and an internet connection.",
        "To transfer concert content between your own devices, open Concert & sync, choose the setlist and shared folder, then send from one device and receive on the other.",
        "To keep a complete recovery copy, open Import, export & backup and create a full backup with audio.",
        "Check that the receiving device can play the downloaded songs before going offline."
      ],
      "note": "Keep your own full backup even when using cloud sharing. A shared link and a recovery backup serve different purposes.",
      "image": "stage.png"
    },
    {
      "id": "midi-cues",
      "category": "Live setup",
      "title": "Connect MIDI and mixer cues",
      "summary": "Set up hands-free control, tempo clock and Soundcraft Ui24R cues.",
      "steps": [
        "Connect a compatible MIDI interface or controller and open Settings → MIDI & pedals.",
        "Map the controls you need, such as Play/Pause, Stop, Next and mute groups.",
        "For tempo sync, choose a MIDI output and enable MIDI Clock. Optional Start/Stop messages can be configured separately.",
        "For Soundcraft Ui24R cue recall, open Cues & Show, enter the mixer’s local IP address and connect. Read the cues, choose a show and cue, then save the link for the song."
      ],
      "note": "MIDI Clock shares tempo. It does not automatically reposition a looper after seeking. Soundcraft Ui24R is the current mixer integration; test every cue and connection with your own equipment.",
      "image": "settings-menu.png"
    }
  ]
};
