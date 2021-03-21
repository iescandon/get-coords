import "./App.css";
import React, {useEffect, useState} from 'react';
import Geocode from 'react-geocode';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function App() {
const [search, setSearch] = useState("")
const [address, setAddress] = useState("")
const [coordinates, setCoordinates] = useState({});
const [copied, setCopied] = useState(false);
const [error, setError] = useState(false)
var myRef = React.createRef();

const handleInputChange = ({ target }) => {
  if (!search) {
    setCoordinates({})
  } 
  const { value } = target;
  setSearch(value);
  setAddress(value);
};

const getLatAndLong = () => {
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
  Geocode.fromAddress(search).then(
    (response) => {
      console.log(response)
      const { lat, lng } = response.results[0].geometry.location;
      setCoordinates({
        lat,
        lng,
      });
    },
    (error) => {
      console.error(error);
      setError(true)
    }
  );
  setSearch('');
};

useEffect(()=>{
  const errorTimer = setTimeout(() => {
    setError(false)

  }, 1000);
},[error])

useEffect(()=>{
  // if (myRef.current) {
  //   myRef.current.style.backgroundColor = "yellow";
  // }
  const timer = setTimeout(() => {
    setCopied(false)
    // if (myRef.current) {
    //   console.log("hi")
    //   myRef.current.style.backgroundColor = "transparent";
    // }
  }, 1000);
}, [copied]);

  return (
    <div>
      <div className="">
        <h1>Get Lat and Lng</h1>
        <form onSubmit={(event) => {
          event.preventDefault();
          getLatAndLong();
        }}>
          <input className="address" value={search} onChange={(event)=>{
            handleInputChange(event);
          }}/><br/>
          {/* <input type="submit" className="submitBtn" value="Submit" /> */}
        </form>
      </div>
      <div className="">

        <h2>Address: {address}</h2>

        <CopyToClipboard text={`${coordinates.lat}, ${coordinates.lng}`} onCopy={() => {setCopied(true)}}>
        <h2>Coordinates: {coordinates.lat ? <span ref={myRef} className="coords">{`${coordinates.lat}, ${coordinates.lng}`}</span> : null}</h2>
        </CopyToClipboard>

        {error ? <p>Put a valid address</p> : null}
        {copied ? <p>Copied to clipboard!</p> : null}
      </div>
    </div>
  );
}

export default App;
