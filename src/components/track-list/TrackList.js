import "./TrackList.css";
import Track from "../track/Track";

const TrackList = ({ trackList, onAdd, onRemove, isRemoval }) => {
  return (
    <div className="TrackList">
      {trackList.map((track) => {
        return (
          <Track
            key={track.id}
            onAdd={onAdd}
            onRemove={onRemove}
            track={track}
            isRemoval={isRemoval}
          />
        );
      })}
    </div>
  );
};

export default TrackList;
