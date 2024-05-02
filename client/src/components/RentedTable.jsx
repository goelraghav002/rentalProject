import "./other.css";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { abi, abiLease, contractAddress } from "../constants";

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
  async function connectToProvider() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setProvider(await new ethers.BrowserProvider(window.ethereum));
        console.log(accounts);
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected request");
        }
      }
    } else {
      console.log(
        "Ethereum provider not detected. Please install MetaMask or a similar wallet."
      );
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      connectToProvider();
    }
  }, []);

  async function TerminateLeaseOwner(leaseId) {
    if (provider) {
      try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        let leaseProxy = await contract.getVault(leaseId);
        leaseProxy = leaseProxy.toString();
        console.log("Lease:", leaseProxy);

        const contractProxy = new ethers.Contract(
          leaseProxy,
          abiLease,
          provider
        ); // Instantiate the contract
        const signer = provider.getSigner(); // Assumes Metamask or similar is injected in the browser
        const contractWithSigner = contractProxy.connect(await signer);

        const tx = await contractWithSigner.terminateLease();
        setStatus("Transaction sent, waiting for confirmation...");
        await tx.wait();
        setStatus("Transaction confirmed!");
      } catch (error) {
        setStatus(error.reason);
        console.error("Error fetching current value:", error);
      }
    } else {
      console.log("Please connect to a wallet to retrieve value.");
    }
  }

  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState("");


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
                    <button
                      className="text-white font-bold uppercase bg-green-700 m-3 p-2 rounded-lg"
                      onClick={() => {
                        TerminateLeaseOwner(listing.contractId);
                      }}
                    >
                      Terminate
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
          <p>{status}</p>
        </div>
      </div>
    </>
  );
}
