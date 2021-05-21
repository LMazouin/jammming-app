import "./Track.css";

const Track = ({ onAdd, onRemove, track, isRemoval }) => {
  const { name, artist, album } = track;

  const addTrack = () => {
    onAdd(track);
  };

  const removeTrack = () => {
    onRemove(track);
  };

  const renderButton = (isRemoval) => {
    return (
      <button
        onClick={isRemoval ? removeTrack : addTrack}
        className="Track-action"
      >
        {isRemoval ? "-" : "+"}
      </button>
    );
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{name}</h3>
        <p>
          {artist} | {album}
        </p>
      </div>
      {renderButton(isRemoval)}
    </div>
  );
};

export default Track;
