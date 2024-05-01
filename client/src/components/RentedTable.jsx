import "./other.css";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function RentedTable() {
    
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);


    useEffect(() => {
        handleShowListings();
    }, []);

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/rented/${currentUser._id}`);
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

    // const handleListingDelete = async (listingId) => {
    //     try {
    //         const res = await fetch(`/api/listing/delete/${listingId}`, {
    //             method: "DELETE",
    //         });
    //         const data = await res.json();
    //         if (data.success === false) {
    //             console.log(data.message);
    //             return;
    //         }

    //         setUserListings((prev) =>
    //             prev.filter((listing) => listing._id !== listingId)
    //         );
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };


    return (
        <>
            <div className=" flex flex-row">
                <div className="p-3 shadow-lg rounded-lg mx-auto w-[950px] my-[30px]">
                    <h1 className="text-5xl font-semibold text-center ">Rented</h1>
                    

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
                                        {/* <button
                                            onClick={() => handleListingDelete(listing._id)}
                                            className="text-white font-bold uppercase bg-red-600 m-3 p-2 rounded-lg"
                                        >
                                            Delete
                                        </button> */}
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
        </>
    );
}
