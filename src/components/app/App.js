import "./App.css";
import { useReducer } from "react";
import SearchBar from "../search-bar/SearchBar";
import SearchResults from "../search-results/SearchResults";
import Playlist from "../playlist/Playlist";
import Spotify from "../../util/Spotify";

const exampleSearchResults = [
  {
    id: 4,
    name: "The Ride of the Valkyries",
    artist: "Richard Wagner",
    album: "The Valkyrie",
  },
  {
    id: 5,
    name: "Fire Magic",
    artist: "Richard Wagner",
    album: "The Valkyrie",
  },
];

const examplePlaylistName = "Industrial Metal";

const examplePlaylistTracks = [
  {
    id: 1,
    name: "High Tech/Low Life",
    artist: "Die Krupps",
    album: "I",
  },
  {
    id: 2,
    name: "The Dawning of Doom",
    artist: "Die Krupps",
    album: "I",
  },
  {
    id: 3,
    name: "The Power",
    artist: "Die Krupps",
    album: "I",
  },
];

const TRACK_ADDED = "TRACK_ADDED";
const TRACK_REMOVED = "TRACK_REMOVED";
const SEARCH_RESULTS_ADDED = "SEARCH_RESULTS_ADDED";
const SEARCH_TERM_CHANGED = "SEARCH_TERM_CHANGED";
const PLAYLIST_NAME_CHANGED = "PLAYLIST_NAME_CHANGED";

const initialState = {
  searchTerm: "",
  searchResults: [],
  playlistName: "New Playlist",
  playlistTracks: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case TRACK_ADDED:
      return {
        ...state,
        playlistTracks: [...state.playlistTracks, action.value],
      };
    case TRACK_REMOVED:
      return {
        ...state,
        playlistTracks: state.playlistTracks.filter(
          (playlistTrack) => playlistTrack.id !== action.value.id
        ),
      };
    case SEARCH_TERM_CHANGED:
      return {
        ...state,
        searchTerm: action.value,
      };
    case SEARCH_RESULTS_ADDED:
      return {
        ...state,
        searchResults: [...state.searchResults, ...action.value],
      };
    case PLAYLIST_NAME_CHANGED:
      return {
        ...state,
        playlistName: action.value,
      };
    default:
      //throw new Error("UNKNOWN ACTION");
      return state;
  }
};

const App = () => {
  // const [searchResults, setSearchResults] = useState(exampleSearchResults);
  // const [playlistName, setPlaylistName] = useState(examplePlaylistName);
  // const [playlistTracks, setPlaylistTracks] = useState(examplePlaylistTracks);

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * adds a track to the playlist if it is not already there
   * @param{object} track - a track object with id, name, artist and album
   * attributes which will be added
   */
  const addTrack = (track) => {
    if (
      !state.playlistTracks.find(
        (playlistTrack) => playlistTrack.id === track.id
      )
    ) {
      // setPlaylistTracks((previousPlaylistTracks) => {
      //   return [...previousPlaylistTracks, track];
      // });
      dispatch({ type: TRACK_ADDED, value: track });
      console.log(state.playlistTracks);
    }
  };

  /**
   * removes a track form the playlist if it is there
   * @param{object} track - a track object with id, name, artist and album
   * attributes which will be removed
   */
  const removeTrack = (track) => {
    if (
      state.playlistTracks.find(
        (playlistTrack) => playlistTrack.id === track.id
      )
    ) {
      // setPlaylistTracks((previousPlaylistTracks) => {
      //   return previousPlaylistTracks.filter(
      //     (playlistTrack) => playlistTrack.id !== track.id
      //   );
      // });
      dispatch({ type: TRACK_REMOVED, value: track });
    }
  };

  /**
   * changes the name of the playlist
   * @param {string} name
   */
  const updatePlaylistName = (name) => {
    dispatch({ type: PLAYLIST_NAME_CHANGED, value: name });
  };

  /**
   * generates an array of uri values from the plalist tracks properties
   */
  const savePlaylist = () => {
    console.log("SAVE PLAYLIST TO SPOTIFY");
    const trackURIs = state.playlistTracks.map((track) => {
      return track.uri;
    });
    Spotify.savePlaylist(state.playlistName, trackURIs);
  };

  /**
   * changes the term in the search bar
   * @param {string} searchTerm
   */
  const updateSearchTerm = (searchTerm) => {
    dispatch({ type: SEARCH_TERM_CHANGED, value: searchTerm });
  };

  /**
   * searches a song on the Spotifiy API
   * @param{string} searchTerm - the song to be searched
   */
  const search = () => {
    // console.log(`SEARCH FOR ${state.searchTerm}`);
    Spotify.search(state.searchTerm).then((data) => {
      // console.table(data);
      // console.table(data.tracks.items);
      const searchResults = data.tracks.items.map((track) => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0]?.name,
          album: track.album.name,
          uri: track.uri,
        };
      });
      // console.table(searchResults);
      dispatch({ type: SEARCH_RESULTS_ADDED, value: searchResults });
    });
  };

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} updateSearchTerm={updateSearchTerm} />
        <div className="App-playlist"></div>
        <SearchResults searchResults={state.searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={state.playlistName}
          playlistTracks={state.playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
};

export default App;
