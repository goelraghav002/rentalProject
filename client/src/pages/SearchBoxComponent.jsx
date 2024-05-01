import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleMap, LoadScript, SearchBox } from '@google/maps';

const apiKey = 'AIzaSyDx-d90HwvcNoSGoapswJivzRQceKimPt0'; // Replace with your actual API key

const libraries = ['places']; // Only load the Places library

const SearchBoxComponent = ({ onSelectPlace }) => {
  const dispatch = useDispatch();

  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);

  // Function to handle place selection
  const handlePlaceChange = () => {
    if (searchBoxRef.current.getPlaces().length > 0) {
      const place = searchBoxRef.current.getPlaces()[0];
      dispatch({ type: 'SET_SELECTED_PLACE', payload: place }); // Dispatch action to update Redux store
      onSelectPlace(place);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={{ display: 'none' }} // Hide map container
        zoom={13}
        center={{ lat: -33.8688, lng: 151.2195 }} // Initial center (adjust if needed)
      >
        <SearchBox
          ref={inputRef}
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
          placeholder="Search for locations"
          onChange={handlePlaceChange}
          onLoad={searchBox => (searchBoxRef.current = searchBox)}
          onPlacesChanged={handlePlaceChange}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default SearchBoxComponent;
