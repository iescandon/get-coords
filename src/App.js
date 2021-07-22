import "./App.css";
import React, {useEffect, useState} from 'react';
import Geocode from 'react-geocode';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function App() {
const [search, setSearch] = useState("");
const [input, setInput] = useState("");
const [address, setAddress] = useState("");
const [coordinates, setCoordinates] = useState({});
const [copied, setCopied] = useState(false);
const [error, setError] = useState(false);
var myRef = React.createRef();

const handleInputChange = ({ target }) => {
  const { value } = target;
  setSearch(value);
  setAddress("");
  setCoordinates({});
  setInput(value);
};

const getLatAndLong = () => {
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
  Geocode.fromAddress(search).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setCoordinates({
        lat,
        lng,
      });
      setAddress(response.results[0].formatted_address);
    },
    (error) => {
      setError(true);
    }
  );
  setInput(search);
  setSearch("");
};

useEffect(()=>{
  setTimeout(() => {
    setError(false);
  }, 2000);
},[error]);

useEffect(()=>{
  setTimeout(() => {
    setCopied(false);
  }, 2000);
}, [copied]);

  return (
    <div className="font-nunito container mx-auto min-h-screen text-center justify-center flex flex-col">
      <section className="">
        <h1 className="mb-6 text-4xl md:text-5xl font-bold uppercase text-gray-700" id="">Get Lat & Lng</h1>
        <form onSubmit={(event) => {
          event.preventDefault();
          getLatAndLong();
        }}>
          <input className="w-3/5 mb-6 p-2 rounded shadow focus:outline-none border border-gray-100" value={search} onChange={(event)=>{
            handleInputChange(event);
          }}/><br/>
        </form>
      </section>
      <section className="flex flex-col flex-wrap">
    {input ? 
      <p className="mx-3 mb-3 sm:text-lg md:text-xl uppercase font-bold text-gray-700">Search: <span className="capitalize font-normal md:p-2 text-gray-500">{input}</span></p>
      : null }
    {address && coordinates ? 
    <React.Fragment>
      <p className="mx-3 mb-3 sm:text-lg md:text-xl uppercase font-bold text-gray-700">Address: <span className="capitalize font-normal md:p-2 text-gray-500">{address}</span></p>
      <p className="mx-3 mb-3 sm:text-lg md:text-xl uppercase font-bold text-gray-700">Coordinates:{' '}
      <CopyToClipboard text={`${coordinates.lat}, ${coordinates.lng}`} onCopy={() => {setCopied(true)}}>
        <span className="capitalize font-normal rounded border border-gray-50 md:p-2 hover:bg-blue-50 md:hover:border-blue-500 cursor-pointer text-gray-500">{`${coordinates.lat}, ${coordinates.lng}`}</span>
      </CopyToClipboard>
      </p>
    </React.Fragment>
    : null }
    </section>
      <section className="mt-4 fixed top-0 right-0 m-5">
        {error ? <p className="p-3 md:p-6 italic sm:text-lg md:text-xl bg-red-500 text-white">Put a valid address!</p> : null}
        {copied ? <p className="p-3 md:p-6 italic sm:text-lg md:text-xl bg-blue-500 text-white">Copied to clipboard!</p> : null}
      </section>
      <div>
</div>
    </div>
  );
}

export default App;
