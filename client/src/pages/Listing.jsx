import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { ethers } from "ethers";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { abi, abiLease, contractAddress } from "../constants";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  /* async function getDetails() {
    if (provider) {
      try {
        const contract = new ethers.Contract(lease, abiLease, provider);
        const ownerVal = await contract.getOwner();
        const tenantVal = await contract.getCurrentTenant();
        setOwner(ownerVal.toString());
        setTenant(tenantVal.toString());
        console.log("Owner:", owner);
        console.log("Tenant:", tenant);
      } catch (error) {
        console.error("Error fetching current value:", error);
      }
    } else {
      console.log("Please connect to a wallet to retrieve value.");
    }
  }*/

  const getLease = async (leaseId) => {
    if (provider) {
      try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const value = await contract.getVault(leaseId);
        setLease(value.toString()); // Convert retrieved value to string
        console.log("Lease:", lease);
      } catch (error) {
        console.error("Error fetching current value:", error);
      }
    } else {
      console.log("Please connect to a wallet to retrieve value.");
    }
  };

  const rent = async () => {
    const contract = new ethers.Contract(lease, abiLease, provider); // Instantiate the contract
    const signer = provider.getSigner(); // Assumes Metamask or similar is injected in the browser
    const contractWithSigner = contract.connect(await signer);

    try {
      let monthlyRent = listing.discountPrice
        ? listing.discountPrice
        : listing.regularPrice;
      monthlyRent *= 3;
      const tx = await contractWithSigner.rent({
        value: ethers.parseUnits(monthlyRent.toString(), "wei"),
      });
      setStatus("Transaction sent, waiting for confirmation...");
      await tx.wait();
      setStatus("Transaction confirmed!");
    } catch (err) {
      console.error(err);
      setStatus(err.reason);
    }
  };

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
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
    if (typeof window !== "undefined") {
      connectToProvider();
    }
  }, [params.listingId]);

  const [provider, setProvider] = useState(null);
  useEffect(() => {
    if (provider && listing) {
      getLease(listing.contractId);
      console.log("Lease:", lease.toString());
    }
  }, [provider]);

  const [status, setStatus] = useState("");
  const [lease, setLease] = useState();

  return (
    <main className="bg-slate-300">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - Rs&nbsp;
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && "/month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={rent}
                className=" text-white bg-blue-400 rounded-lg uppercase hover:opacity-95 p-3"
              >
                RENT
              </button>
            )}
            <p>{status}</p>
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
