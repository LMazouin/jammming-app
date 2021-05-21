const AUTH = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "b999c0d9f4e84c6c84efa28dc35cbde0";
const RESPONSE_TYPE = "token";
const REDIRECT_URI = "http://localhost:3000/";
const SCOPE = "user-read-private user-read-email";
// const SCOPE = "playlist-modify-public";

// ???
let accessToken = window.localStorage.getItem("accessToken");
// time after which the access token expires
let expiresIn = "";

const SPOTIFY_API_URL = "https://api.spotify.com";
const endpoint = "/v1/search?type=track,artist,album";

const Spotify = {
  /**
   * returns the access token if it is already set
   * otherwise gets it from the Spotify URL
   */
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    // ???
    if (accessToken && expiresIn) {
      // clear the parameters from the URL,
      // so the app doesn’t try grabbing the access token after it has expired
      // ???
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("access token", null, "/");
    } else {
      const accessURL = `${AUTH}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`;
      window.location = accessURL;
    }
    const spotifyURL = window.location.href;
    console.log(spotifyURL);
    const regExp =
      /access_token=(?<accessToken>[^&]*).*expires_in=(?<expiresIn>[^&]*)/;
    const matches = spotifyURL.match(regExp).groups;
    accessToken = matches.accessToken;
    expiresIn = matches.expiresIn;
    window.localStorage.setItem("accessToken", accessToken);
    return accessToken;
  },
  /**
   * returns a promise that will eventually resolve
   * to the list of tracks from the search
   * @param {string} searchTerm
   */
  async search(searchTerm) {
    const accessToken = this.getAccessToken();
    const url = `${SPOTIFY_API_URL}${endpoint}&q=${searchTerm}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
  },

  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs) {
      return;
    }
    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    // get user information
    const endpointGetUser = "https://api.spotify.com/v1/me";
    const responseGetUser = await fetch(endpointGetUser, {
      headers: headers,
    });
    const dataUser = await responseGetUser.json();
    const userId = dataUser.id;

    // create a new playlist and get the playlist id
    const endpointCreatePlaylist = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const bodyCreatePlaylist = JSON.stringify({ name: name });
    const responseCreatePlaylist = await fetch(endpointCreatePlaylist, {
      headers: headers,
      method: "POST",
      body: bodyCreatePlaylist,
    });
    const dataCreatePlaylist = await responseCreatePlaylist.json();
    const playlistId = dataCreatePlaylist.id;

    // add items to the playlist
    console.table(trackURIs);
    const endpointAddItems = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const bodyAddItems = JSON.stringify({ uris: trackURIs });
    const responseAddItems = await fetch(endpointAddItems, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: bodyAddItems,
    });
    const dataAddItems = await responseAddItems.json();
    console.table(dataAddItems);
  },
};

export default Spotify;
