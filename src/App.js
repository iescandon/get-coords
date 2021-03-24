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
  // if (!search) {
  //   setCoordinates({})
  // } 
  const { value } = target;
  setSearch(value);
  setAddress("");
  setCoordinates({})
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
      setAddress(response.results[0].formatted_address);
    },
    (error) => {
      console.error(error);
      setError(true)
    }
  );
  setSearch("");
};

useEffect(()=>{
  const errorTimer = setTimeout(() => {
    setError(false)

  }, 1000);
  // clearTimeout(errorTimer)
},[error])

useEffect(()=>{
  // if (myRef.current) {
  //   myRef.current.style.backgroundColor = "yellow";
  // }
  const feedbackTimer = setTimeout(() => {
    setCopied(false)
    // if (myRef.current) {
    //   console.log("hi")
    //   myRef.current.style.backgroundColor = "transparent";
    // }
  }, 1000);
  // clearInterval(feedbackTimer)
}, [copied]);

  return (
    <div className="container">
      <section>
        <h1 id="title">Get Lat and Lng</h1>
        <form onSubmit={(event) => {
          event.preventDefault();
          getLatAndLong();
        }}>
          <input className="address" value={search} onChange={(event)=>{
            handleInputChange(event);
          }}/><br/>
          {/* <input type="submit" className="submitBtn" value="Submit" /> */}
        </form>
      </section>
    {address && coordinates ? 
      <section>
        <p className="header">Address: <span className="description">{address}</span></p>
        <CopyToClipboard text={`${coordinates.lat}, ${coordinates.lng}`} onCopy={() => {setCopied(true)}}>
        <p className="header">Coordinates: <span ref={myRef} className="coords description">{`${coordinates.lat}, ${coordinates.lng}`}</span></p>
        </CopyToClipboard>
      </section>
    : null }
      <section>
        {error ? <p className="description red">Put a valid address!</p> : null}
        {copied ? <p className="description blue">Copied to clipboard!</p> : null}
      </section>
    </div>
  );
}

export default App;
