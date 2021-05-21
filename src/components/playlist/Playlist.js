import "./Playlist.css";
import TrackList from "../track-list/TrackList";

const Playlist = ({
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
}) => {
  return (
    <div className="Playlist">
      <input
        defaultValue={playlistName}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TrackList
        trackList={playlistTracks}
        onRemove={onRemove}
        isRemoval={true}
      />
      <button className="Playlist-save" onClick={onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;
