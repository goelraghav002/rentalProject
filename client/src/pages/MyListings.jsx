import "./other.css";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import profilehouse from "../assets/profilehouse.jpg";
import RentedTable from "../components/RentedTable";

export default function MyListings() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    handleShowListings();
  }, []);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className=" flex flex-row">
        <div className="p-3 shadow-lg rounded-lg mx-auto w-[950px] my-[30px]">
          <h1 className="text-5xl font-semibold text-center ">My Listings</h1>
          <div className="flex justify-center m-6">
            <Link
              className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95  w-[200px] "
              to={"/create-listing"}
            >
              Create Listing
            </Link>
          </div>

          {/* <button
            onClick={handleShowListings}
            className="text-green-700 w-full"
          >
            Show Listings
          </button>
          <p className="text-red-700 mt-5">
            {showListingsError ? "Error showing listings" : ""}
          </p> */}

          {userListings && userListings.length > 0 && (
            <div className="flex my-4 flex-col gap-4">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="border rounded-lg p-3 flex justify-between items-center gap-4"
                >
                  {console.log(listing)}
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link
                    className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className="flex flex-row item-center">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-white font-bold uppercase bg-red-600 m-3 p-2 rounded-lg"
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="text-white font-bold uppercase bg-green-700 m-3 p-2 rounded-lg">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
          <RentedTable />
    </>
  );
}
